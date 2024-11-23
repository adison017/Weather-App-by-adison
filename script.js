const apiKey = 'e91dac7698f7b004a628e488426b6244'; // แทนที่ด้วย API Key จาก OpenWeatherMap
const weatherInfo = document.getElementById('weather-info');
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim(); // ใช้ trim() เพื่อให้ลบช่องว่างก่อนและหลังจากการกรอก
    if (city === '') {
        // แจ้งเตือนเมื่อผู้ใช้ไม่กรอกชื่อเมือง
        Swal.fire({
            icon: 'warning',
            title: 'กรุณากรอกชื่อเมือง',
            text: 'ไม่สามารถค้นหาสภาพอากาศได้หากไม่มีชื่อเมือง',
            confirmButtonText: 'ตกลง',
             confirmButtonColor: '#CC00CC'
        });
    } else {
        getWeather(city);
    }
});

async function getWeather(city) {
    weatherInfo.style.display = "none"; // ซ่อนข้อมูลก่อนโหลด
    searchBtn.textContent = "กำลังค้นหา..."; // แสดงสถานะการโหลด
    searchBtn.disabled = true;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("ไม่พบข้อมูลของเมืองนี้");
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        // แจ้งเตือนเมื่อเกิดข้อผิดพลาดในการค้นหาข้อมูล
        Swal.fire({
            icon: 'error',
            title: 'ไม่สามารถค้นหาสภาพอากาศได้',
            text: error.message,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#CC00CC'
        });
    } finally {
        searchBtn.textContent = "ค้นหาสภาพอากาศ";
        searchBtn.disabled = false;
    }
}

function displayWeather(data) {
    weatherInfo.style.display = "block";
    document.getElementById('city-name').textContent = `สภาพอากาศใน ${data.name}`;
    document.getElementById('temperature').textContent = `อุณหภูมิ: ${data.main.temp}°C`;
    document.getElementById('description').innerHTML = `สภาพอากาศ: ${data.weather[0].description}
    <div class="flex justify-center mt-2">
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather-icon" class="mx-auto">
    </div>`;
    document.getElementById('humidity').textContent = `ความชื้น: ${data.main.humidity}%`;
    document.getElementById('wind').textContent = `ความเร็วลม: ${data.wind.speed} m/s`;

    // แสดง SweetAlert เมื่อข้อมูลได้รับการโหลดสำเร็จ
    Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: `ข้อมูลสภาพอากาศของ ${data.name} ถูกโหลดเรียบร้อยแล้ว!`,
        confirmButtonText: 'ตกลง',
         confirmButtonColor: '#CC00CC'
    });
}
