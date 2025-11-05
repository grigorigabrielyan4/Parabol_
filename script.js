// "Read More" կոճակը բացում է Վիքիպեդիան նոր թաբում
document.getElementById("readMore").addEventListener("click", () => {
  window.open("https://hy.wikipedia.org/wiki/%D5%8A%D5%A1%D6%80%D5%A1%D5%A2%D5%B8%D5%AC%D5%A1%D5%B5%D5%AB%D5%B6_%D5%A1%D5%B6%D5%BF%D5%A5%D5%B6%D5%A1", "_blank");
});

// Փափուկ հայտնվելու էֆեկտ քարտերի համար
const cards = document.querySelectorAll(".card");

function showCardsOnScroll() {
  const trigger = window.innerHeight * 0.85;
  cards.forEach(card => {
    const top = card.getBoundingClientRect().top;
    if (top < trigger) card.classList.add("visible");
  });
}

window.addEventListener("scroll", showCardsOnScroll);
window.addEventListener("load", showCardsOnScroll);

