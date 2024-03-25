document.addEventListener("DOMContentLoaded", function () {
	const newsForm = document.getElementById("newsForm");
	const newsResults = document.getElementById("newsResults");
	const stockInfoDiv = document.getElementById("stockInfo");

	newsForm.addEventListener("submit", function (event) {
		event.preventDefault();

		const symbolInput = document.getElementById("symbol");
		const symbol = symbolInput.value;

		fetch("/getNews", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ symbol: symbol }),
		})
			.then((response) => response.json())
			.then((newsData) => {
				//Clear Previous Results
				newsResults.innerHTML = "";

				// Display the fetched news
				newsData.data.forEach((newsItem) => {
					const publishedDate = new Date(newsItem.published_at);

					const options = {
						month: "long",
						day: "numeric",
						year: "numeric",
					};

					const formattedDate = publishedDate.toLocaleDateString(
						"en-us",
						options
					);

					const div = document.createElement("div");
					div.classList.add("pt-3");
					div.innerHTML =
						"<a href='" +
						newsItem.url +
						"'>" +
						newsItem.title +
						"</a><br>Source: " +
						newsItem.source +
						" | " +
						formattedDate;
					newsResults.appendChild(div);
				});
			})
			.catch((error) => {
				console.error("Error fetching news:", error);
			});

		fetch("/getStockInfo", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ symbol: symbol }),
		})
			.then((response) => response.json())
			.then((infoData) => {
				//Clear Previous Results
				stockInfoDiv.innerHTML = "";
				stockInfoDiv.classList.add("pt-3");

				//Display Info
				const metaData = infoData["Meta Data"];
				const monthlyTimeSeries = infoData["Monthly Time Series"];

				// EXTRACT DATES (KEYS) FROM OBJECT
				const allDates = Object.keys(monthlyTimeSeries);

				// Sort dates in descending order (extraction is not guarantteed to be in order)
				allDates.sort((a, b) => new Date(b) - new Date(a));

				// SLICE MOST RECENT 12
				const last12Dates = allDates.slice(0, 12);

				const stockInfoTitle = document.createElement("h3");
				stockInfoTitle.textContent = `Last 12 Months: ${metaData["2. Symbol"]}`;
				stockInfoDiv.appendChild(stockInfoTitle);

				const stockRefresh = document.createElement("p");
				stockRefresh.textContent = `Last Refreshed: ${metaData["3. Last Refreshed"]}`;
				stockInfoDiv.appendChild(stockRefresh);

				//Loop Through The monthlyTimeSeries Dataset
				last12Dates.forEach((date) => {
					const data = monthlyTimeSeries[date];

					const dateObject = new Date(date);
					const formattedDate = `${dateObject.toLocaleString(
						"en-us",
						{ month: "long" }
					)} ${dateObject.getFullYear()}`;

					const openValue = parseFloat(data["1. open"]);
					const formattedOpen = openValue.toFixed(2);

					const closeValue = parseFloat(data["4. close"]);
					const formattedClose = closeValue.toFixed(2);

					const monthlyDiv = document.createElement("div");
					monthlyDiv.classList.add("pt-3");
					monthlyDiv.innerHTML = `
											<h4>${formattedDate}</h4>
												<table class="table table-bordered text-center">
													<thead>
														<tr>
															<th scope="col">Monthly Open</th>
															<th scope="col">Monthly Close</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<td>$ ${formattedOpen}</td>
															<td>$ ${formattedClose}</td>
														</tr>
													</tbody>
												</table>				
											`;
					stockInfoDiv.appendChild(monthlyDiv);
				});

				//CHART.JS attempt

				// Extract Closing Data from Past 12 Months
				// const monthlyClose = last12Dates.map((date) =>
				// 	parseFloat(monthlyTimeSeries[date]["4. close"])
				// );

				// console.log(monthlyClose);

				// Chart.defaults.adapters.date = Date;

				//Line Chart
				// const ctx = document
				// 	.getElementById("stockChart")
				// 	.getContext("2d");

				// const stockChart = new Chart(ctx, {
				// 	type: "line",
				// 	data: {
				// 		labels: last12Dates,
				// 		datasets: [
				// 			{
				// 				label: `${metaData["2. Symbol"]} Monthly Closing Prices`,
				// 				data: monthlyClose,
				// 				backgroundColor: "rgba(75, 192, 192, 0.2)",
				// 				borderColor: "rgba(75, 192, 192, 1)",
				// 				borderWidth: 1,
				// 			},
				// 		],
				// 	},
				// 	options: {
				// 		scales: {
				// 			x: {
				// 				type: "time",
				// 				time: {
				// 					displayFormats: {
				// 						month: `MMM YYYY`,
				// 					},
				// 				},
				// 			},
				// 			y: {
				// 				title: {
				// 					display: true,
				// 					text: "Price (USD)",
				// 				},
				// 			},
				// 		},
				// 	},
				// });
			});
	});
});
