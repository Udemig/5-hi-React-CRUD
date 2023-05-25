import { useState } from 'react';
import BookCard from './components/BookCard';
import { toast } from 'react-toastify';
import EditModal from './components/EditModal';

function App() {
  const [bookName, setBookName] = useState('');
  const [books, setBooks] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // ekle butonuna tıklandığı anda çalışır
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bookName) {
      // bildirim verme
      toast.warn('Lütfen Kitap İsmi Giriniz', { autoClose: 2000 });
      // fonksiyonu durdurma
      return;
    }

    // kitap için gerekli bilgilere sahip obje oluşturma
    const newBook = {
      id: new Date().getTime(),
      title: bookName,
      date: new Date().toLocaleString(),
      isRead: false,
    };

    // oluşturulan kitap objesini kitaplar dizine aktar
    // spread operator önceden eklenenleri muhafaza eder
    setBooks([...books, newBook]);

    // eleman eklenince inputu sıfırla
    setBookName('');

    // bildirim ver
    toast.success('Kitap Eklendi', { autoClose: 2500 });
  };

  // modalı el alma
  const handleModal = (id) => {
    // idyi state aktarma
    setDeleteId(id);
    // modalı açma
    setShowConfirm(true);
  };

  // sil butonuna bastığında çalışır
  const handleDelete = (deletingId) => {
    // silinicek id ye eşit olmayan objeleri al ve bir diziye aktar
    const filtred = books.filter((item) => item.id !== deletingId);

    //  oluşan diziyi state aktar
    setBooks(filtred);

    // bildirim ver
    toast.error('Kitap Silindi', { autoClose: 2500 });
  };

  // okundu butonuna basınca çalışır
  // 1- okundu değerini tersine çevir
  // 2- books dizisinin bir kopyasını oluştur
  // 3- düzenlenicek olan kitabın dizideki sırasını bul >  findIndex
  // 4- eski kitabı kopya diziden çıkar yerine güncellenmiş versiyonu koy > splice
  // 5- güncel olan kopya diziyi state'e aktar
  const handleRead = (book) => {
    const updatedBook = { ...book, isRead: !book.isRead };

    const cloneBooks = [...books];

    const index = cloneBooks.findIndex((item) => item.id === book.id);

    cloneBooks.splice(index, 1, updatedBook);

    setBooks(cloneBooks);
  };

  // kitabı günceller
  const handleEditBook = () => {
    // değişicek elemanın dizideki sırasını bulur
    const index = books.findIndex((book) => book.id === editItem.id);

    // kitaplar dizisinin kopyasını oluşturma
    const cloneBooks = [...books];

    //eski kitabı diziden çıkar yerine yenisini koy
    cloneBooks.splice(index, 1, editItem);

    // statei güncelle > kopya diziyi state aktar
    setBooks(cloneBooks);

    // modalı kapat
    setShowEditModal(false);
  };

  return (
    <div>
      {/* header */}
      <div className="bg-dark text-light px-5 py-2 fs-5 text-center">Kitap Kurdu</div>
      <div className="container border">
        {/* form */}
        <form onSubmit={handleSubmit} className="d-flex gap-3 mt-4">
          <input
            onChange={(e) => setBookName(e.target.value)}
            value={bookName}
            className="form-control shadow"
            type="text"
          />
          <button className="btn btn-warning shadow">Ekle</button>
        </form>

        <div className="d-flex flex-column gap-3 py-5">
          {/* eğer state içerisi boş ise ekrana bunu yaz */}
          {books.length === 0 && <h4>Henüz herhangi bir kitap eklenmedi</h4>}

          {/* eğer stateiçerisinde eleman varsa onları listele */}
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              handleModal={handleModal}
              handleRead={handleRead}
              setShowEditModal={setShowEditModal}
              setEditItem={setEditItem}
            />
          ))}
        </div>
      </div>

      {/* modalı tanımlama */}
      {showConfirm && (
        <div className="confirm-modal">
          <div className="modal-inner shadow">
            <h5>Silmek İstiyor musunuz ?</h5>
            <button className="btn btn-warning" onClick={() => setShowConfirm(false)}>
              Vazgeç
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                handleDelete(deleteId);
                setShowConfirm(false);
              }}
            >
              Onayla
            </button>
          </div>
        </div>
      )}

      {/* düznelme modalı */}
      {showEditModal && (
        <EditModal
          setShowEditModal={setShowEditModal}
          setEditItem={setEditItem}
          editItem={editItem}
          handleEditBook={handleEditBook}
        />
      )}
    </div>
  );
}

export default App;
