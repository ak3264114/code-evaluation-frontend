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
	const [loading, setLoading] = useState(false);
	const [userData, setUserData] = useState({
		username: "",
		language: "93",
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
		setLoading(true);

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
		} finally {
			setLoading(false);
		}
	};

	const handleEditorChange = (value) => {
		setUserData({ ...userData, code: value });
	};

	const handleChange = (e) => {
		setUserData({ ...userData, [e.target.name]: e.target.value });
	};

	return (
		<main className="">
			<div className="bg-white px-6 py-6">
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
							{loading ? (
								<button
									type="button"
									className="cursor-not-allowed block rounded-md bg-indigo-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 "
								>
									<svg
										aria-hidden="true"
										className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
										viewBox="0 0 100 101"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
											fill="currentColor"
										/>
										<path
											d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
											fill="currentFill"
										/>
									</svg>
									<span className="sr-only">Loading...</span>
								</button>
							) : (
								<button
									type="submit"
									className="block rounded-md bg-indigo-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									&nbsp;Run&nbsp;
								</button>
							)}
						</div>
					</form>
				</div>
			</div>
		</main>
	);
};

export default Form;
