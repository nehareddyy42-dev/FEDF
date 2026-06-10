import { useState, createContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import AddBook from './components/AddBook.jsx'
import BookDetail from './components/BookDetail.jsx'
import './App.css'

export const BookContext = createContext()

const INITIAL_BOOKS = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    year: 1925,
    rating: 4,
    status: 'Read',
    description: 'A story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, set against the backdrop of the Roaring Twenties.',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    year: 1960,
    rating: 5,
    status: 'Read',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Sci-Fi',
    year: 1965,
    rating: 5,
    status: 'Reading',
    description: 'Set in the distant future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides.',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
  },
  {
    id: 4,
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    year: 2018,
    rating: 4,
    status: 'Read',
    description: 'An easy and proven way to build good habits and break bad ones with tiny changes that deliver remarkable results.',
    cover: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&h=400&fit=crop',
  },
  {
    id: 5,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    year: 2020,
    rating: 4,
    status: 'Want to Read',
    description: 'Between life and death there is a library where each book gives you the chance to try another life you could have lived.',
    cover: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=300&h=400&fit=crop',
  },
  {
    id: 6,
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Sci-Fi',
    year: 2021,
    rating: 5,
    status: 'Reading',
    description: 'A lone astronaut must save the earth from disaster in this incredible new science-based thriller.',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=400&fit=crop',
  },
]

function App() {
  const [books, setBooks] = useState(INITIAL_BOOKS)
  const [searchQuery, setSearchQuery] = useState('')

  const addBook = (book) => {
    const newBook = {
      ...book,
      id: Date.now(),
    }
    setBooks(prev => [newBook, ...prev])
  }

  const deleteBook = (id) => {
    setBooks(prev => prev.filter(b => b.id !== id))
  }

  const updateBook = (id, updatedFields) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updatedFields } : b))
  }

  const stats = {
    total: books.length,
    read: books.filter(b => b.status === 'Read').length,
    reading: books.filter(b => b.status === 'Reading').length,
    wantToRead: books.filter(b => b.status === 'Want to Read').length,
  }

  return (
    <BookContext.Provider value={{ books, addBook, deleteBook, updateBook, searchQuery, setSearchQuery, stats }}>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<AddBook />} />
              <Route path="/book/:id" element={<BookDetail />} />
            </Routes>
          </div>
        </main>
        <footer className="app-footer">
          <div className="container">
            <p>© 2026 <span className="footer-brand">BookShelf</span> — Your Personal Library</p>
          </div>
        </footer>
      </div>
    </BookContext.Provider>
  )
}

export default App
