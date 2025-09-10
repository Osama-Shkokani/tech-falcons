document.getElementById("weather-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const place = document.getElementById("placeName").value;
    const date = document.getElementById("appointment-date").value;
    const time = document.getElementById("appointment-time").value;
    const activity = document.getElementById("activity") ? document.getElementById("activity").value : "غير محدد";

    const output = document.getElementById("output-display");
    const body = document.getElementById("body");
    const adviceElement = document.getElementById("advice");

    if (!place) {
        output.textContent = "⚠️ الرجاء إدخال اسم المكان.";
        return;
    }

    if (!date || !time) {
        output.textContent = "⚠️ الرجاء اختيار التاريخ والوقت.";
        return;
    }

    try {
        const apiKey = "cd329fb82a6bbbb9ae7f88515f024e5a";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apiKey}&units=metric&lang=ar`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.cod !== 200) {
            output.textContent = "❌ لم يتم العثور على المكان.";
            return;
        }

        const temp = data.main.temp;
        const weather = data.weather[0].main.toLowerCase();

        // عرض المعلومات الأساسية
        output.textContent = `🌍 المكان: ${place} | 🌡️ الحرارة: ${temp}°C | ☁️ الطقس: ${data.weather[0].description}\n📅 التاريخ: ${date} | ⏰ الوقت: ${time}\n🎯 النشاط: ${activity}`;

        // تحليل الطقس
        const forecast = analyzeWeather(temp, weather, data.wind.speed);
        const advice = giveAdvice(temp, weather, data.wind.speed);

        // عرض النصيحة
        if(adviceElement) {
            adviceElement.textContent = `💡 نصيحة: ${advice}`;
        }

        // تغيير الخلفية حسب الطقس
        if (weather.includes("cloud")) {
            body.style.backgroundImage = "url('images/cloudy.jpg')";
        } else if (weather.includes("rain")) {
            body.style.backgroundImage = "url('images/rainy.jpg')";
        } else if (weather.includes("sun") || weather.includes("clear")) {
            body.style.backgroundImage = "url('images/sunny.jpg')";
        } else if (weather.includes("snow")) {
            body.style.backgroundImage = "url('images/snow.jpg')";
        } else {
            body.style.backgroundImage = "url('images/stars.jpg')"; // الافتراضية
        }

        body.style.backgroundSize = "cover";
        body.style.backgroundPosition = "center";
        body.style.transition = "background 1s ease-in-out";

    } catch (error) {
        output.textContent = "⚠️ حدث خطأ أثناء جلب البيانات.";
    }
});

// تحليل الطقس إذا مناسب أو لا
function analyzeWeather(temp, weather, wind) {
    if (weather.includes("rain") || weather.includes("storm")) return "غير مناسب - ممطر/عاصف";
    if (temp > 35) return "غير مناسب - حار جداً";
    if (temp < 5) return "غير مناسب - بارد جداً";
    if (wind > 40) return "غير مناسب - عاصف جداً";
    return "مناسب للنشاط";
}

// نصائح حسب الحالة
function giveAdvice(temp, weather, wind) {
    if (weather.includes("rain")) return "احمل مظلة أو حاول تأجيل النشاط.";
    if (temp > 35) return "اشرب الكثير من الماء وتجنب الشمس المباشرة.";
    if (temp < 5) return "ارتدِ ملابس دافئة واشرب مشروبات ساخنة.";
    if (wind > 40) return "انتبه من الرياح القوية وحاول البقاء في مكان آمن.";
    return "الطقس معتدل! يمكنك القيام بالنشاطات الخارجية أو ممارسة الرياضة.";
}

// الخلفية الإفتراضية عند فتح الموقع أول مرة
window.addEventListener("load", () => {
    const body = document.getElementById("body");
    body.style.backgroundImage = "url('images/defimage.jpg')";
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
});
