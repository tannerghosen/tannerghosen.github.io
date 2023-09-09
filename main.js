// JavaScript

// var mode = "";
// mode was changed from a variable to a localstorage item so like page, we can autosave that setting too!
if (!localStorage.getItem("mode"))
{
	localStorage.setItem("mode", "dark");
	
}
if (localStorage.getItem("mode"))
{
	localStorage.getItem("mode");
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
			document.body.classList.remove("notransition");
		},500);
	}
	
	document.getElementById("lightswitch").addEventListener("click", (r) =>
	{

		if (localStorage.getItem("mode") == "dark") {
			localStorage.setItem("mode", "light");
			LightSwitch();
		}
		else if (localStorage.getItem("mode") == "light") {
			localStorage.setItem("mode", "dark");
			LightSwitch();
		}
	});

// Time Function
	function TheTime() 
	{ 
		var time = new Date();

		var [month, day, year, hour, minute, second, period] = [time.getMonth()+1, time.getDate(), time.getFullYear(), time.getHours(), time.getMinutes(), time.getSeconds(), "AM"];
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
			hour = hour - 12;
		}

		if(document.getElementById("time"))
		{
			document.getElementById("time").innerHTML = `Today is ${month}/${day}/${year} and the time is ${hour}:${minute}:${second} ${period}.`;
		}
	}

	TheTime();
	var timer = setInterval(() => TheTime(), 1000);

// Slideshow
	document.getElementById("backbutton").addEventListener("click", () =>
	{
		if(project == 1)
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
	document.getElementById("nextbutton").addEventListener("click", () =>
	{
		if(project == maxprojects)
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
// Show/Hide Buttons
	document.body.addEventListener("click", (e) =>
	{
		if(e.target.tagName == "A") 
		{
			var href = e.target.getAttribute("href");
			if(href == "#portfolio")
			{
				document.getElementById("buttoncontainer").removeAttribute("hidden");
			}
			else
			{
				document.getElementById("buttoncontainer").setAttribute("hidden","");
			}
		}
	});

// Router (part 1)
	const app = document.getElementById("app");
	
	if(localStorage.getItem("lastpage"))
	{
		loadpage(localStorage.getItem("lastpage"));
		if(localStorage.getItem("lastpage") == "portfolio")
		{
			document.getElementById("buttoncontainer").removeAttribute("hidden");
		}
	}
	else
	{
		loadpage("home");
	}
});

// Router (part 2)
// header is website's head, head is loaded page's head that's removed.
const pages = "pages";
const parser = new DOMParser();
const stringtohtml = function(string) 
{
	return parser.parseFromString(string, "text/html"); 
}
const loadpage = (page) =>
{
	var header = document.getElementById("page");
	document.body.addEventListener("click", (ev) =>
	{
		if(ev.target.tagName == "A") 
		{
			if (ev.target.href.includes("http") == false)
			{
				ev.preventDefault();
			}
		}
	});
	
	fetch(`./${pages}/${page}.html`)
		.then(response => {
			return response.text() 
			})
		.then(data => {
			data = stringtohtml(data);
			app.innerHTML = data.body.innerHTML;
			var head = document.getElementById("header");
			header.innerHTML = head.innerHTML;
			document.title = head.innerHTML;
			head.parentNode.removeChild(head);
			localStorage.setItem("lastpage",page);
		}).catch(error => console.log(error))
}