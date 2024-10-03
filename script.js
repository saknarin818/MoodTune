// เมนูเครื่องดื่ม
const drinks = {
    happy: {
        name: "Strawberry Smoothie",
        ingredients: "สตรอเบอร์รี่, โยเกิร์ต, นม, น้ำเชื่อม",
        image: "image/Strawberry Smoothie.jpg"
    },
    stressed: {
        name: "Iced Matcha Latte",
        ingredients: "ชาเขียวมัทฉะ, นม, น้ำแข็ง, น้ำตาล",
        image: "image/Iced Matcha Latte.jpg"
    },
    tired: {
        name: "Cold Brew Coffee",
        ingredients: "กาแฟสกัดเย็น, น้ำแข็ง, น้ำตาล",
        image: "image/Cold Brew Coffee.jpg"
    }
};

// ฟังก์ชันแสดงข้อมูลเครื่องดื่ม
function displayDrink(mood) {
    const drink = drinks[mood];
    const drinkName = document.getElementById('drink-name');
    const drinkIngredients = document.getElementById('drink-ingredients');
    const drinkImage = document.getElementById('drink-image');

    if (drink) {
        drinkName.textContent = drink.name;
        drinkIngredients.textContent = `ส่วนประกอบ: ${drink.ingredients}`;
        drinkImage.src = drink.image;
        drinkImage.alt = drink.name;
        drinkImage.style.display = "block"; // แสดงรูปภาพ
    }
}

// การอ้างอิงปุ่ม
const happyBtn = document.getElementById('happy-btn');
const stressedBtn = document.getElementById('stressed-btn');
const tiredBtn = document.getElementById('tired-btn');

// Event listeners สำหรับปุ่ม
happyBtn.addEventListener('click', () => displayDrink('happy'));
stressedBtn.addEventListener('click', () => displayDrink('stressed'));
tiredBtn.addEventListener('click', () => displayDrink('tired'));
