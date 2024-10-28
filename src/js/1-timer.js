/////////////////
import flatpickr from 'flatpickr';
//////////////////
import 'flatpickr/dist/flatpickr.min.css';
////////////////

import iziToast from 'izitoast';
///////////////////
import 'izitoast/dist/css/iziToast.min.css';

const timePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const dataDays = document.querySelector('.value[data-days]');
const dataHours = document.querySelector('.value[data-hours]');
const dataMinutes = document.querySelector('.value[data-minutes]');
const dataSeconds = document.querySelector('.value[data-seconds]');

startBtn.disabled = true;

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (Date.now() > selectedDates[0]) {
      startBtn.disabled = true;

      iziToast.error({
        title: 'Error',
        backgroundColor: 'tomato',
        message: 'Please choose a date in the future',
        messageColor: 'white',
        messageSize: '20',
        position: 'topRight',
        close: true,
        displayMode: 2,
      });
    } else {
      startBtn.disabled = false;
      iziToast.success({
        title: 'OK',
        message: 'Press Start button!',
      });
    }
  },
};

flatpickr(timePicker, options);

function onClickBtn() {
  startBtn.disabled = true;
  timePicker.disabled = true;

  const timer = setInterval(() => {
    const currentDate = Date.now();
    const ms = userSelectedDate - currentDate;

    const { days, hours, minutes, seconds } = convertMs(ms);

    dataDays.textContent = addLeadingZero(days);
    dataHours.textContent = addLeadingZero(hours);
    dataMinutes.textContent = addLeadingZero(minutes);
    dataSeconds.textContent = addLeadingZero(seconds);

    if (seconds === 0 && minutes === 0 && hours === 0 && days === 0) {
      clearInterval(timer);
      timePicker.disabled = false;
    }
  }, 1000);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
startBtn.addEventListener('click', onClickBtn);
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
