// JavaScript

// var mode = "";
// mode was changed from a variable to a localStorage item so like page, we can save that setting too!
if (!localStorage.getItem("mode"))
{
	localStorage.setItem("mode", "dark");
}
var project = 1;
var maxprojects = 4;
var slideshow = false;

document.addEventListener("DOMContentLoaded", () =>
{

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
		setTimeout(function()
		{
			document.body.classList.remove("notransition"); // we don't want it forever because that'll mess up future transitions.
		},500);
	}
	
	document.getElementById("lightswitch").addEventListener("click", () =>
	{
		if (localStorage.getItem("mode") == "dark") 
		{ 
			localStorage.setItem("mode", "light"); // we set it to light mode if it was dark mode
			LightSwitch();
		}
		else if (localStorage.getItem("mode") == "light") 
		{
			localStorage.setItem("mode", "dark"); // vice versa of above
			LightSwitch();
		}
	});

// Time Function
	function TheTime() 
	{ 
		// time.getMonth()+1 if you use x/x/xxxx for day format
		let time = new Date();
		let months = ["Janurary", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		let [month, day, year, hour, minute, second, period] = [months[time.getMonth()], time.getDate(), time.getFullYear(), time.getHours(), time.getMinutes(), time.getSeconds(), "AM"];
		// it will only show the minute/second without a 0 in front of it (should it be less than 10) without these two ifs
		if (minute < 10)
		{
			minute = "0"+minute;
		}

		if (second < 10)
		{
			second = "0"+second;
		}

		if (hour >= 12)
		{
			period = "PM";
		}
		else if (hour <= 11)
		{
			period = "AM";
		}

		if (hour > 12) 
		{
			// time uses the 24 hour clock, we want a normal clock, so remove 12 hours if it's greater than that.
			hour -= 12;
		}

		if(document.getElementById("time"))
		{
			document.getElementById("time").innerHTML = `Today is ${month} ${day}, ${year} and the time is ${hour}:${minute}:${second} ${period}.`;
		}
	}

	TheTime();
	let timer = setInterval(() => TheTime(), 1000);

// Slideshow
	// Back Button
	document.getElementById("backbutton").addEventListener("click", () =>
	{
		if(project == 1) // if we are at the first project, go to the last project.
		{
			project = maxprojects;
			document.getElementById("project1").setAttribute("hidden","");
			document.getElementById("project"+project).removeAttribute("hidden");
		}
		else
		{
			project--;
			document.getElementById("project"+(project+1)).setAttribute("hidden","");
			document.getElementById("project"+project).removeAttribute("hidden");
		}
	});
	// Next Button
	document.getElementById("nextbutton").addEventListener("click", () =>
	{
		if(project == maxprojects) // if we are at the last project, go to the first project.
		{
			project = 1;
			document.getElementById("project"+maxprojects).setAttribute("hidden","");
			document.getElementById("project"+project).removeAttribute("hidden");
		}
		else
		{
			project++;
			document.getElementById("project"+(project-1)).setAttribute("hidden","");
			document.getElementById("project"+project).removeAttribute("hidden");
		}
	});

// Links
	document.body.addEventListener("click", (e) =>
	{
		if (e.target.tagName == "A")
		{
			if (e.target.href.includes("http") == false)
			{
				e.preventDefault(); // this is we so we don't reload the page on clicking a non http/s link.
			}
		}
	});

// Router (part 1)
	const app = document.getElementById("app");
	
	if(localStorage.getItem("lastpage")) // if we visited the site before, load the last page.
	{
		LoadPage(localStorage.getItem("lastpage"));
	}
	else // first time we were here, load home.
	{
		LoadPage("home");
	}
});

// Router (part 2)
const pages = "./pages";
const parser = new DOMParser();
const stringtoHTML = function(string) 
{
	return parser.parseFromString(string, "text/html"); 
}
const LoadPage = (page) =>
{
	let header = document.getElementById("header"); // header is index.html's header

	fetch(`${pages}/${page}.html`)
		.then(response => {
			return response.text() // we grab the content of the page, but it is a string
			})
		.then(data => {
			data = stringtoHTML(data); // we make our data HTML from a string, as it should be
			app.innerHTML = data.body.innerHTML; // the div id 'app' will contain our string-to-HTML data from the loaded page.
			let head = document.getElementById("page"); // loaded pages have a h1 header that is the name of the page, with an id of "page"
			header.innerHTML = head.innerHTML; // let's set index.html's header to match the header from the loaded page
			document.title = head.innerHTML; // and let's set our title to the loaded page's name too
			head.parentNode.removeChild(head); // and remove the h1 header from the loaded page, as we don't need duplicates.
			localStorage.setItem("lastpage", page); // and we set the page here in case we reload or come back later.
		}).catch(error => console.log(error))

// Show/Hide Buttons
	if (page == "portfolio") // if the page is Portfolio, make buttons visible.
	{
		document.getElementById("buttoncontainer").removeAttribute("hidden");
	}
	else
	{
		document.getElementById("buttoncontainer").setAttribute("hidden", "");
	}
}