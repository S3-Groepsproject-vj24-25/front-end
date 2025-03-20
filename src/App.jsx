import menuItems from "./data/menuItems"

export default function App() {

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex-1 flex flex-col w-full mx-auto">
        <header className="w-full bg-secondary text-white p-4 flex justify-center items-center">
          <h1 className="text-xl font-medium">Willem</h1>
        </header>

        <main className="flex-1 flex flex-col p-4">
          <h2 className="text-xl font-bold mb-4">Menu</h2>

          <div className="w-full flex-1 flex flex-wrap">
            {menuItems.map((item) => (
              <div key={item.id} className="w-1/2 px-2 mb-4 md:w-1/3 lg:w-1/4">
                <div className="h-full rounded-lg overflow-hidden shadow-sm border flex flex-col">
                  <div className="relative w-full">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-32 object-cover" />
                  </div>
                  <div className="p-2 flex-1 flex flex-col justify-between">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-sm mt-1">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full p-4 bg-white">
          <button className="w-full bg-primary text-white py-3 px-4 rounded-lg flex justify-between items-center hover:bg-[#7a1a1a] transition-colors">
            <span className="font-medium">Order Details</span>
            <span>$00,00</span>
          </button>
        </footer>
      </div>
    </div>
  )
}

