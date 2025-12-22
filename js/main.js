// Variables
if (!localStorage.getItem("mode"))
{
	localStorage.setItem("mode", "dark");
}
var project = 1;
var maxprojects = 0;
if (!localStorage.getItem("linkbar"))
{
	localStorage.setItem("linkbar", "closed");
}

// Holiday Dictionary, used in TheTime() function to display special messages on holidays.
const dates =
{
	birthday: ["June 29", "<b><i>Happy Birthday, Tanner!</i></b> 🎂"]
}
// Functions
document.addEventListener("DOMContentLoaded", () =>
{
	// Mobile Check
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
	{
		console.log('mobile');
		let link = document.createElement("link");
		link.href = "./css/mobile.css";
		link.rel = "stylesheet";
		document.head.appendChild(link);
	}
	else
	{
		console.log('not mobile')
	}

	// Light/Dark Mode Function
	function LightSwitch()
	{
		// toggles lightmode from all tags in document.body (everything)
		document.body.classList.toggle("lightmode");
	}

	if (localStorage.getItem("mode") === "light") // if the last time we were on the page it was light mode (not default), turn on light mode.
	{
		LightSwitch();
		document.body.classList.add("notransition"); //  without this, you'll see the dark mode briefly as it'll do a transition effect to switch to light mode on the code being ran.
		setTimeout(() =>
		{
			document.body.classList.remove("notransition"); // we don't want it forever because that'll mess up future transitions.
		}, 500);
	}
	
	document.getElementById("lightswitch").addEventListener("click", () =>
	{
		localStorage.setItem("mode", localStorage.getItem("mode") == "dark" ? "light" : "dark");
		LightSwitch();
	});

	// Navbar-related stuff, if it was last open before refresh we remember this
	if(localStorage.getItem("linkbar") === "open")
	{
		NavbarToggle();
	}

	// Time Function
	function TheTime()
	{
		// time.getMonth()+1 if you use x/x/xxxx for day format
		let time = new Date();
		let months = ["Janurary", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		let [month, day, year, hour, minute, second, period, weekday] = [months[time.getMonth()], time.getDate(), time.getFullYear(), time.getHours(), time.getMinutes(), time.getSeconds(), "AM", days[time.getDay()]];

		// it will only show the minute/second without a 0 in front of it (should it be less than 10) without these two ifs
		if (minute < 10)
		{
			minute = "0" + minute;
		}

		if (second < 10)
		{
			second = "0" + second;
		}

		if (hour >= 12)
		{
			period = "PM";
		}
		else if (hour <= 11)
		{
			period = "AM";
		}

		// time uses the 24 hour clock, we want a 12 hour clock, so remove 12 hours if it's greater than that.
		if (hour > 12)
		{
			hour -= 12;
		}

		// we don't want midnight showing up as 0.
		if (hour == 0)
		{
			hour = 12;
		}

		if (document.getElementById("time"))
		{
			document.getElementById("time").innerHTML = `Today is ${weekday}, ${month} ${day}, ${year} and the time is ${hour}:${minute}:${second} ${period}.`;
			HolidayCheck(months[time.getMonth()] + " " + time.getDate());
		}
	}

	function HolidayCheck(d)
	{
		const today = `${d}`;
		Object.entries(dates).forEach(([key, [date, msg]]) => // for each key value pair (key -> [date , msg]) in the dates dictionary
		{
			if(date === today)
			{
				document.getElementById("time").innerHTML += "<br>" + msg;
			}
		});
	}

	TheTime();
	let timer = setInterval(() => TheTime(), 1000);

	// Links
	document.body.addEventListener("click", (e) =>
	{
		if (e.target.tagName == "A" && e.target.href.includes("/") == false && e.target.href.includes("http") == false) // if anchor tag
		{
			e.preventDefault(); // this is so we don't reload the page on clicking a non http/s link.
		}
	});

	if(!localStorage.getItem("visited"))
	{
		localStorage.setItem("visited", true);
		document.getElementsByClassName('header')[0].style.animation = "fadein 1s forwards";
		setTimeout(() => { document.getElementsByClassName('container')[0].style.visibility = "visible"; }, 3000);
		document.getElementsByClassName('container')[0].style.animation = "fadein 1s forwards";
		document.getElementsByClassName('container')[0].style.animationDelay = "2s";
	}
	else
	{
		document.getElementsByClassName('container')[0].style.visibility = "visible";
	}
});

// Portfolio related stuff
if (window.location.href.includes("Portfolio")) // if we are on the portfolio page
{
	maxprojects = document.getElementsByClassName("project").length; // count how many projects there are and set maxprojects to that.
	document.getElementById("app").style = "height: 50vh;"; // set the height of the app div to 50% of the viewport height

	// Slideshow
	// Back Button
	document.getElementById("backbutton").addEventListener("click", () =>
	{
		if (project == 1) // if we are at the first project, go to the last project.
		{
			project = maxprojects;
			document.getElementById("project1").setAttribute("hidden", "");
			document.getElementById("project" + project).removeAttribute("hidden");
		}
		else
		{
			project--;
			document.getElementById("project" + (project + 1)).setAttribute("hidden", "");
			document.getElementById("project" + project).removeAttribute("hidden");
		}
	});
	// Next Button
	document.getElementById("nextbutton").addEventListener("click", () =>
	{
		if (project == maxprojects) // if we are at the last project, go to the first project.
		{
			project = 1;
			document.getElementById("project" + maxprojects).setAttribute("hidden", "");
			document.getElementById("project" + project).removeAttribute("hidden");
		}
		else
		{
			project++;
			document.getElementById("project" + (project - 1)).setAttribute("hidden", "");
			document.getElementById("project" + project).removeAttribute("hidden");
		}
	});
}

// Navbar
function NavbarToggle()
{
	let l = document.getElementById("links");
	l.style.display = l.style.display === "block" ? "none" : "block";
	localStorage.setItem("linkbar", l.style.display  == "block" ? "open" : "closed"); // if set to block it was open, otherwise it's closed
}