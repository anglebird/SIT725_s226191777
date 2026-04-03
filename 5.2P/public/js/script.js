document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/books")
      .then((response) => response.json())
      .then((books) => {
        const booksList = document.getElementById("books-list");
        booksList.innerHTML = "";
  
        books.forEach((book) => {
          const bookCard = document.createElement("div");
          bookCard.classList.add("book-card");
  
          bookCard.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
          `;
  
          booksList.appendChild(bookCard);
        });
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        document.getElementById("books-list").innerHTML =
          "<p>Failed to load books.</p>";
      });
  });