import React, { useEffect, useState } from "react";
const column = [
	{
		name: "ID",
	},
	{
		name: "Username",
	},
	{
		name: "language",
	},
	{
		name: "stdIn",
	},
	{
		name: "code",
	},
	{
		name: "Submitted At",
	},
	{
		name: "Output",
	},
];

const GetSubmission = ({ slug }) => {
	const [submissionData, setSubmissionData] = useState([
		{
			id: 16,
			username: "amit",
			language: "",
			stdin: null,
			code: "",
			submittedAt: "",
			execution_data: "",
		},
	]);

	const fetchData = async (userId) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/${userId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (response.status === 200) {
				const responseData = await response.json();
				console.log(responseData);

				setSubmissionData(responseData?.data);

				return responseData;
			} else {
				console.log(response);
			}
		} catch (error) {
			console.error("Error during polling:", error);
			return { error: error.message };
		}
	};

	useEffect(() => {
		fetchData(slug);
	}, []);

	return (
		<main>
			<div className="flex items-center justify-center">
				<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 shadow-md sm:rounded-lg">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							{column.map((item, index) => (
								<th key={index} scope="col" className="py-3 px-6">
									{item.name}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{submissionData?.map((item, index) => (
							<tr
								key={index}
								className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
							>
								<td className="py-4 px-6">{item?.id}</td>
								<td className="py-4 px-6">{item?.username}</td>
								<td className="py-4 px-6">{item?.language}</td>
								<td className="py-4 px-6">{item?.stdin}</td>
								<td className="py-4 px-6">{item?.code?.slice(0, 100)}</td>
								<td className="py-4 px-6">{item?.submittedAt}</td>
								<td className="py-4 px-6">{item?.execution_data}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</main>
	);
};

export default GetSubmission;

export async function getServerSideProps(context) {
	const { params } = context;
	const { slug } = params;

	return { props: { slug: slug } };
}
