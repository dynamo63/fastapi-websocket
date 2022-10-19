import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {

  const [items, setItems] = useState([])
  const [inputUID, setInputUID] = useState("")
  const [inputWeight, setInputWeight] = useState(0)
  const disabledBtn = inputUID == "" && inputWeight == null
  const URL = "http://127.0.0.1:8000/"

  const ws = new WebSocket("ws://127.0.0.1:8000/ws")

  useEffect(() => {
    axios.get(URL + "transactions").then(res => {
      setItems(res.data)
    })
  }, [])

  ws.onopen = () => {
    console.log("Open")
  }

  ws.onmessage = message => {
    if (message.type === "message"){
      const item = JSON.parse(JSON.parse(message.data))
      const data = [...items]
      data.unshift(item)
      setItems(data)
    }
  }

  const handleAdd = () => {

    const today = new Date()
    const data = {
      "uid": inputUID,
      "weight": inputWeight,
      "created_date": today.toISOString()
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }

    fetch(URL + "transactions/add/", requestOptions).then(res => {
      if (res.status === 200){
        console.log('created')
        // reset value
        setInputUID("")
        setInputWeight(0)
      }
    }).catch(() => {
      console.error('Error')
    })
  }

  return (
    <>
      <h1 className="text-3xl text-center mt-4 mb-4">Hello World Employers</h1>

      <div className='w-3/5 mx-auto flex justify-around'>
        <div>
          <input
            type="text"
            className="
              form-control
              block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
            "
            placeholder="UID"
            onChange={e => setInputUID(e.currentTarget.value)}
            value={inputUID}
          />
        </div>
        <div>
          <input
            type="number"
            className="
              form-control
              block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
            "
            value={inputWeight}
            onChange={e => setInputWeight(e.currentTarget.value)}
            placeholder="Weight"
          />
        </div>

        <div className="flex space-x-2 justify-center">
          <button disabled={disabledBtn} onClick={handleAdd} type="button" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Ajouter</button>
        </div>

      </div>

      <div className='w-3/5 mx-auto'>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-white border-b">
                    <tr>
                      <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        UID
                      </th>
                      <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        Weight
                      </th>
                      <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        Created Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.uid} className="bg-gray-100 border-b">
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {item.uid}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {item.weight}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {new Date(item.created_date).toLocaleString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
