import playList from "./playList.js";


//! --------------------------- DATE-----------------------------------------
const dates = document.querySelector(".date")
const date = new Date();

function showDate() {
  const date = new Date();
  let options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  }
  const currentDate = date.toLocaleDateString("en-US", options);
  dates.textContent = `${currentDate}`;
};

//! --------------------------- GREETING-----------------------------------------
const greeting = document.querySelector(".greeting");
const hours = date.getHours();
function getTimeOfDay() {
  if (hours >= 6 && hours < 12) {
    return "morning";
  } else if (hours >= 12 && hours < 18) {
    return "afternoon"
  } else if (hours >= 18 && hours < 24) {
    return "evening"
  } else return "night";
};
const timeOfDay = getTimeOfDay();
function showGreeting() {
const greetingText = `Good ${timeOfDay}`;
greeting.textContent = `${greetingText}`
};

const inputName = document.querySelector(".name");
function setLocalStorage() {
  localStorage.setItem("name", inputName.value);
}
window.addEventListener("beforeunload", setLocalStorage);

function getLocalStorage() {
  if(localStorage.getItem("name")) {
    inputName.value = localStorage.getItem("name");
  }
}
window.addEventListener("load", getLocalStorage);

//! --------------------------- Background-----------------------------------------
const getRandomNum = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const body = document.querySelector(".body")
let randomNumStr = "" + getRandomNum(1, 20);

const setBg = () => {
  let bgNum = randomNumStr.padStart(2, 0);
  body.style.backgroundImage = `URL('https://raw.githubusercontent.com/SogoHlopec/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`
}
setBg()

//! --------------------------- Slider-----------------------------------------
const getSlideNext = () => {
  randomNumStr = Number(randomNumStr) + 1 + "";
  if (randomNumStr === "21") {
    randomNumStr = "1";
  }
  setBg();
}

const getSlidePrev = () => {
  randomNumStr = Number(randomNumStr) - 1 + "";
  if (randomNumStr === "0") {
    randomNumStr = "20";
  }
  setBg()
}

const slideNext = document.querySelector(".slide-next");
slideNext.addEventListener("click", getSlideNext);

const slidePrev = document.querySelector(".slide-prev");
slidePrev.addEventListener("click", getSlidePrev);

//! --------------------------- Weather -----------------------------------------
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const windSpeed = document.querySelector(".wind-speed");
const humidity = document.querySelector(".humidity");
const weatherDescription = document.querySelector(".weather-description");
const city = document.querySelector(".city");
const weatherError = document.querySelector(".weather-error");
city.value = "Minsk";


async function getWeather() {
  const urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=266fed02e7b78ff15bf38203ff2d4580&units=metric`;
  const res = await fetch(urlWeather);
  const data = await res.json();
  if (data.message) {
    weatherError.textContent = `Error! ${data.message}`
    temperature.textContent = "";
    windSpeed.textContent = "";
    humidity.textContent = "";
    weatherDescription.textContent = "";
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.remove(`owf-${data.weather}`);
  } else
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    weatherError.textContent = "";
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    windSpeed.textContent = `Wind speed: ${Math.round(data.wind.speed)}m/s`;
    humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}%`;
    weatherDescription.textContent = data.weather[0].description;
  }

getWeather();
function setCityLocalStorage() {
  localStorage.setItem("city", city.value);
}

function getCityLocalStorage() {
  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
    getWeather()
  }
}
city.addEventListener("keydown", setCityLocalStorage);
window.addEventListener("load", getCityLocalStorage);

function setCity(event) {
  if (event.keyCode === 13) {
    getWeather();
    city.blur();
  }
}
city.addEventListener("keydown", setCity);

//! --------------------------- Quotes-----------------------------------------
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const changeQuote = document.querySelector(".change-quote");


async function getQuotes() {
  const quotes = `data.json`;
  const res = await fetch(quotes)
  const data = await res.json()
  const position = getRandomNum(0, data.length);
  quote.textContent = `${data[position].text}`;
  author.textContent = `${data[position].author}`
}
getQuotes()

changeQuote.addEventListener("click", getQuotes);

//! --------------------------- Audio-player----------------------------------------
const audio = document.querySelector('.audio');
const play = document.querySelector('.play');
const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');
let playNum = 0;

let isPlay = false;

const playAudio = () => {
  if(!isPlay) {
    audio.src = `${playList[playNum].src}`;
    audio.currentTime = 0;
    audio.play();
    isPlay = true;
  } else if (isPlay) {
    audio.pause();
    isPlay = false;
  }
  activeItem()
}
play.addEventListener("click", playAudio)


const toogleBtn = () => {
  play.classList.toggle("pause");
}
const playPrevBtn = () => {
  if (!isPlay) {
    playNum === 0 ? playNum = 3 : playNum -= 1;
    playAudio()
    play.classList.add("pause")
  } else if (isPlay) {
    playNum === 0 ? playNum = 3 : playNum -= 1;
    isPlay = false;
    playAudio()
    progressTrack.style.width = "0%";
  }
  addTitleTrack();
}
const playNextBtn = () => {
  if (!isPlay) {
    playNum > 2 ? playNum = 0 : playNum += 1;
    playAudio()
    play.classList.add("pause")
  } else if (isPlay) {
    playNum > 2 ? playNum = 0 : playNum += 1;
    isPlay = false;
    playAudio()
    progressTrack.style.width = "0%";
  }
  addTitleTrack();
}
const ul = document.querySelector(".play-list")
playList.forEach(element => {
  const li = document.createElement("li");
  const liBtn = document.createElement("button")
  li.classList.add("play-item");
  li.textContent = `${element.title}`;
  liBtn.classList.add("play")
  liBtn.classList.add("player-icon")
  liBtn.classList.add("player-icon-mini")
  ul.append(li);
  li.append(liBtn);
});

const allLi = document.querySelectorAll(".play-item");
const activeItem = () => {
  allLi.forEach(element => {
    element.classList.remove("item-active");
  });
  allLi[playNum].classList.add("item-active");
}
activeItem();

audio.addEventListener("ended", playNextBtn)
play.addEventListener("click", toogleBtn)
playPrev.addEventListener("click", playPrevBtn)
playNext.addEventListener("click", playNextBtn)

//! --------------------------- ADVANCED AUDIO PLAYER-----------------------------------------
const titleTrack = document.querySelector(".title-track");

function addTitleTrack() {
  titleTrack.textContent = `${playList[playNum].title}`;
}
addTitleTrack();

const timeLine = document.querySelector(".time-line");
const progressTrack = document.querySelector(".progress-track");
let timeTrack = playList[playNum].duration;


timeLine.addEventListener("click", e => {
  let timeTrack = playList[playNum].duration;
  const timeLineWidth = timeLine.offsetWidth;
  let arr = timeTrack.split(":");
  timeTrack = Number(arr[0]) * 60 + Number(arr[1]);
  let timeToSeek = e.offsetX / parseInt(timeLineWidth) * timeTrack;
  audio.currentTime = timeToSeek
  progressTrack.style.width = (((timeToSeek / timeTrack) * 100) || 0) + "%";
}, false);

function progressBarChange() {
    let timeTrack = playList[playNum].duration;
    let arr = timeTrack.split(":");
    timeTrack = Number(arr[0]) * 60 + Number(arr[1]);
    progressTrack.style.width = (((audio.currentTime / timeTrack) * 100) || 0) + "%";
};

const soundVolume = document.querySelector(".sound-volume");
soundVolume.addEventListener("input", function() {
  audio.volume = soundVolume.value;
});

const muteButton = document.querySelector(".mute-button");
function muteSound() {
  if (soundVolume.value > 0) {
    audio.volume = 0;
    soundVolume.value = 0;
  } else {
    soundVolume.value = 1;
    audio.volume = 1;
  }
}
muteButton.addEventListener("click", muteSound);

const timer = document.querySelector(".timer");
function timeDisplay() {
  let timeCurrent = Math.round(audio.currentTime);
  let minutes = Math.floor(timeCurrent / 60) || 0;
  let seconds = (timeCurrent - minutes * 60) || 0;
  timer.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}/${playList[playNum].duration}`
};


  let all = document.querySelectorAll('ul li button');
  for (let index = 0; index < all.length; index++) {
  all[index].addEventListener('click', (e) => {
    playNum = index;
    playAudio()
    e.target.classList.toggle("pause");
    play.classList.toggle("pause");
  })
}


//! --------------------------- TIME-----------------------------------------
const time = document.querySelector(".time");

function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  setTimeout(showTime, 1000);
  time.textContent = `${currentTime}`;
  showDate();
  progressBarChange();
  timeDisplay();
};
showTime();
showGreeting();

console.log(`
Часы и календарь +15;
Приветствие +10;
Смена фонового изображения +20;
Виджет погоды +15
Виджет цитата дня +10
Аудиоплеер +15
Продвинутый аудиоплеер (реализуется без использования библиотек) +18.5
Итого: 103,5
`);