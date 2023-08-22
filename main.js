const container = document.querySelector(".container");
//console.log(container)

const infoText = document.querySelector(".infoText");
//console.log(infoText)

const movie = document.getElementById("movie");
//console.log(movie)

const seats = document.querySelectorAll(".seat:not(.reserved)");
//console.log(seats)

//Tarayıcı Veri Tabanından Verileri Okuma
const getSeatsDataFromDatabase = () => {
  //Seçilen filmin index verisini getiryoruz

  const dbSelectedMovie = JSON.parse(localStorage.getItem("movieIndex"));
  //console.log(dbSelectedMovie)

  if (dbSelectedMovie) {
    movie.selectedIndex = dbSelectedMovie;
  }

  const dbSelectSeats = JSON.parse(localStorage.getItem("selectedIndex"));

  //console.log(dbSelectSeats)
  if (dbSelectSeats !== null && dbSelectSeats.length > 0) {
    
    seats.forEach((seat, index) => {
      if (dbSelectSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }
};

//Tarayıcı Veri Tabanına Kayıt Fonksiyonu

const saveToDatabase = (seatIndexData) => {
  //local storage basit verileri taraycısı hafisaında tutmak içi kullnaılbilir
  //Verileri json formatın kaydeder
  //localstorage.setItem(key,value) veri ekler
  //localstorage.getItem(key) verileri okur

  localStorage.setItem("selectedIndex", JSON.stringify(seatIndexData));
  localStorage.setItem("movieIndex", JSON.stringify(movie.selectedIndex));
};

//getSeatsDataFromDatabase()

getSeatsDataFromDatabase();

//Toplam Tutar Hesablama ve Koltukların Indeks Numarlarının Tespit Fonksiyonu
const calculateTotal = () => {
  //*** Veritabanı İşlemleri ***

  //1-Seçilen koltukalrın bilgisi
  //2-Tüm koltukların indeks

  const selectedSeats = container.querySelectorAll(".seat.selected");
  //console.log(selectedSeats)

  //Tüm seçilen koltukları NodeListten normal diziye dönürürken kullanacağız
  const allSeatsArray = [];
  const allSelectedSeatsArray = [];

  seats.forEach((seat) => {
    allSeatsArray.push(seat);
  });

  //console.log(allSeatsArray)

  selectedSeats.forEach((selectedSeat) => {
    allSelectedSeatsArray.push(selectedSeat);
  });

  //console.log(allSelectedSeatsArray)

  let selectedIndexs = allSelectedSeatsArray.map((allSelectedSeat) => {
    return allSeatsArray.indexOf(allSelectedSeat);
  });
  //console.log(selectedIndexs)

  //****Hesablama İşlemleri ****

  //console.log(movie.value)
  // console.log('Hesablama Fonksşyınum çalıştı')
  //her tıklanıldığın fonksiyon çalışır ve hem seat hem selected classına sahip elementi bulur
  let selectedSeatsCount = container.querySelectorAll(".seat.selected").length;
  //console.log(selectedSeatsCount)

  if (selectedSeatsCount > 0) {
    infoText.style.display = "block";
  } else {
    infoText.style.display = "none";
  }

  let price = movie.value;
//   console.log(price)

  let total = price * selectedSeatsCount;
//   console.log(total)

  infoText.innerHTML = `
   <span >${selectedSeatsCount}</span> koltuk için hesaplanan ücret <span>${total}</span>TL
   `;

  saveToDatabase(selectedIndexs);
};
calculateTotal();

container.addEventListener("click", (mouseEvent) => {
  //tıkladığımız elemanın maouseEventte da nereye denk geldiği bulduk
  //console.log(mouseEvent.target.offsetParent)

  //1-tıklalnaılan elmanın classliti seat classı içercek reserved clasıı içermeyecek
  //2-yukardaki aşamayı sağyalacak sorugu oluşturaca
  //3-sorgunun olumlu sonuçlanması halinde gelen eleman bizim boş koltuğumuzdur
  //4-toggle ile tıklanınca selected classını ekle çıkar yapacaz

  if (
    mouseEvent.target.offsetParent.classList.contains("seat") &&
    // ! operatörü yardımıyla şartı sağlamasını sağladık
    !mouseEvent.target.offsetParent.classList.contains("reserved")
  ) {
    //tıklanılan elemente selected classını verecek

    mouseEvent.target.offsetParent.classList.toggle("selected");

    calculateTotal();
  }
});

movie.addEventListener("change", () => {
  calculateTotal();

});