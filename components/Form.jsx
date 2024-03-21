import { Editor } from "@monaco-editor/react";
import React, { useState } from "react";
var base64 = require("base-64");
import { useRouter } from "next/router";

const languageOptions = [
	{
		label: "Java Script",
		value: "93",
	},
	{
		label: "Python",
		value: "92",
	},
	{
		label: "Java",
		value: "62",
	},
	{
		label: "C++",
		value: "52",
	},
];

const Form = () => {
	const router = useRouter();
	const [language, setLanguage] = useState(languageOptions[0]);
	const [userData, setUserData] = useState({
		username: "",
		language: "",
		code: "",
		stdIn: "",
	});

	const poll = async (executionId) => {
		let isPolling = true;
		while (isPolling) {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/${executionId}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
					},
				);

				if (response.status === 200) {
					const responseData = await response.json();
					console.log(response);
					console.log(responseData);
					isPolling = false;
					router.push(`/submission/${userData.username}`);
					return responseData;
				} else {
					console.log(response);
				}
			} catch (error) {
				console.error("Error during polling:", error);
				return { error: error.message };
			}
		}
	};

	const handleLanguageChange = (e) => {
		setLanguage({
			label: e.target.name,
			value: e.target.value,
		});
		setUserData({ ...userData, language: e.target.value });
	};
	const handleFormSubmit = async (e) => {
		const base64Code = base64.encode(userData.code);

		e.preventDefault();
		try {
			const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...userData,
					code: base64Code,
				}),
			});
			if (response.ok) {
				const data = await response.json();

				poll(data?.data?.token);
				return data;
			} else if (response.status === 429) {
				console.log("Too many requests. Waiting for some time...");
			} else {
				console.log(response);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			throw error;
		}
	};

	const handleEditorChange = (value) => {
		setUserData({ ...userData, code: value });
	};

	const handleChange = (e) => {
		setUserData({ ...userData, [e.target.name]: e.target.value });
	};
	return (
		<div className="isolate bg-white px-6 py-6">
			<div className="mx-auto">
				<form onSubmit={handleFormSubmit} autoComplete="off">
					<div className="grid gap-y-6 gap-x-8 sm:grid-cols-4 items-center">
						<div className="col-span-2">
							<label className="block text-base font-semibold leading-6 text-gray-900">
								User name
							</label>
							<input
								className=" h-10 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								name="username"
								type="text"
								placeholder={"Please enter your username here"}
								onChange={handleChange}
								required
								value={userData.username}
							/>
						</div>
						<div className="col-span-2">
							<label className="block text-base font-semibold leading-6 text-gray-900 ">
								preferred code language
							</label>

							<select
								className=" h-10 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								name={language.label}
								value={language.value}
								onChange={handleLanguageChange}
								required
							>
								{languageOptions.map((item, index) => (
									<option key={index} name={item.label} value={item.value}>
										{item.label}
									</option>
								))}
							</select>
						</div>
						<div className="col-span-2">
							<label className="block text-base font-semibold leading-6 text-gray-900 ">
								standard input (stdin)
							</label>

							<Editor
								width={`100%`}
								height={"70vh"}
								language={language.value || "javascript"}
								value={userData?.code}
								theme="vs-dark"
								onChange={handleEditorChange}
							/>
						</div>
						<div className="col-span-2">
							<label className="block text-base font-semibold leading-6 text-gray-900 ">
								standard input (stdin)
							</label>

							<textarea
								onChange={handleChange}
								className="h-[70vh] block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
					<div className="mt-10 flex justify-end gap-6">
						<button
							type="button"
							className="block rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Reset
						</button>
						<button
							type="submit"
							className="block rounded-md bg-indigo-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Add
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Form;
