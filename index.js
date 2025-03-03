const express = require("express")
const app = express()

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const { initializeDatabase } = require("./db/db.connect")
const Book = require("./models/books.models")

app.use(express.json())
initializeDatabase()

// const newBook = {
//     "title": "Lean In",
//     "author": "Sheryl Sandberg",
//     "publishedYear": 2012,
//     "genre": ["Non-fiction", "Business"],
//     "language": "English",
//     "country": "United States",
//     "rating": 4.1,
//     "summary": "A book about empowering women in the workplace and achieving leadership roles.",
//     "coverImageUrl": "https://example.com/lean_in.jpg"
//   };

async function createBook(newBook){
    try {
       const book = new Book(newBook)
       const saveBook = await book.save()
       return saveBook
    } catch(error){
        throw error
    }
}
app.post("/books", async (req, res) => {
    try{
        const savedBook = await createBook(req.body)
        res.status(201).json({message: "Book added successfully.", book: savedBook})
    } catch(error){
        res.status(500).json({error: "Failed to add book."})
    }
})

// to get all the books in the database
async function readAllBooks(){
    try{
      const allBooks = await Book.find()
      return allBooks
    } catch(error){
        console.log(error)
    }
}
app.get("/books", async (req, res) => {
    try{
      const books = await readAllBooks()
      if(books.length != 0){
        res.json(books)
      } else{
        res.status(404).json({error: "No books found"})
      }
    } catch(error){
        res.status(500).json({error: "Failed to fetch books"})
    }
})

// to get a book by its title
async function readBookByTitle(title){
    try{
      const book = await Book.findOne({title: title})
      return book
    } catch(error){
        throw error
    }
}
app.get("/books/:title", async (req, res) => {
    try{
      const book = await readBookByTitle(req.params.title)
      if(book){
        res.json(book)
      } else{
        res.status(404).json({error: "Book not found."})
      }
    } catch(error){
        res.status(500).json({error: "Failed to fetch book"})
    }
})

// to get a book by its author
async function readBookByAuthor(author){
    try{
      const book = await Book.findOne({author: author})
      return book
    } catch(error){
        throw error
    }
}
app.get("/books/author/:authorName", async (req, res) => {
    try{
    const book = await readBookByAuthor(req.params.authorName)
    if(book){
        res.json(book)
    } else{
        res.status(404).json({error: "Book not found."})
    }
    } catch(error){
        res.status(500).json({error: "Failed to fetch book."})
    }
})

// to get the books by its genre
async function readBooksByGenre(genre){
    try{
        const books = await Book.find({genre: genre})
        return books
    } catch(error){
        throw error
    }
}
app.get("/books/genre/:genreName", async (req, res) => {
    try{
        const books = await readBooksByGenre(req.params.genreName)
        if(books.length != 0){
            res.json(books)
        } else{
            res.status(404).json({error: "Books not found"})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch books."})
    }
})

// to get books by its year
async function readBooksByYear(year){
    try{
        const books = await Book.find({publishedYear: year})
        return books
    } catch(error){
        throw error
    }
}
app.get("/books/publishedYear/:bookYear", async (req, res) => {
    try{
        const books = await readBooksByYear(req.params.bookYear)
        if(books.length != 0){
            res.json(books)
        } else{
            res.status(404).json({error: "Books not found"})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch books"})
    }
})

// to read and update the book by its id
async function updateBook(bookId, dataToUpdate){
    try{
        const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {new: true})
        return updatedBook
    } catch(error){
        console.log("Error in updating the data", error)
    }
}
app.post("/books/:bookId", async (req, res) => {
    try{
        const updatedBook = await updateBook(req.params.bookId, req.body)
        if(updatedBook){
            res.status(200).json({message: "Book updated successfully,", updateBook: updatedBook})
        } else{
            res.status(404).json({error: "Book not found."})
        }
    } catch(error){
        res.status(500).json({error: "Failed to update book."})
    }
})

// update with its title
async function updateByTitle(title, dataToUpdate){
    try{
     const updatedbook = await Book.findOneAndUpdate({title: title}, dataToUpdate, {new: true})
     return updatedbook
    } catch(error){
        console.log("Error in updating the data.", error)
    }
}
app.post("/books/title/:giveTitle", async (req, res) => {
    try{
      const updatedBook = await updateByTitle(req.params.giveTitle, req.body)
      if(updatedBook){
        res.status(200).json({message: "Book updated successfully.", updatedBook: updatedBook})
      } else{
        res.status(404).json({error: "Book not found."})
      }
    } catch(error){
        res.status(500).json({error: "Failed to update book."})
    }
})

// delete a book by id
async function deleteBookById(bookId){
    try{
      const deletedBook = await Book.findByIdAndDelete(bookId)
      return deletedBook
    } catch(error){
        console.log(error)
    }
}
app.delete("/books/:bookId", async (req, res) => {
    try{
      const deletedBook = await deleteBookById(req.params.bookId)
      res.status(200).json({message: "Book deleted successfully."})
    } catch(error){
        res.status(500).json({error: "Failed to delete book."})
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})