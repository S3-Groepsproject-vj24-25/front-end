/* eslint-disable react/prop-types */
const MenuItems = ({ items }) => {
    return (
      <div className="w-full flex flex-wrap -mx-2">
        {items.map((item) => (
          <div key={item.id} className="w-1/2 px-2 mb-4 md:w-1/3 lg:w-1/4">
            <div className="h-full rounded-lg overflow-hidden shadow-sm border flex flex-col">
              <div className="relative w-full">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-32 object-cover" />
              </div>
              <div className="p-2 flex-1 flex flex-col justify-between">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <div className="flex flex-row justify-between">
                    <p className="text-sm mt-1">${item.price.toFixed(2)}</p>
                    <button className="bg-primary rounded-full h-4 w-4 text-white text-md leading-4 font-bold">
                        <p className=" -mt-[2px]">+</p>
                        </button>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  export default MenuItems
  
  