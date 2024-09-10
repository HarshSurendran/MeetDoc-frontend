

const DoctorHome = () => {
  return (
    <div className="bg-blue-100 min-h-screen flex">
      <div className="w-1/4 p-8 bg-blue-200">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <div className="mb-4">
          <div className="bg-blue-400 p-3 rounded-md">
            <h3 className="text-white font-semibold">Bookings</h3>
          </div>
        </div>
        <div className="mb-4">
          <div className="bg-blue-400 p-3 rounded-md">
            <h3 className="text-white font-semibold">Revenue</h3>
          </div>
        </div>
        <div className="mb-4">
          <div className="bg-blue-400 p-3 rounded-md">
            <h3 className="text-white font-semibold">Profile</h3>
          </div>
        </div>
        <div className="mt-auto">
          <div className="bg-blue-400 p-3 rounded-md">
            <h3 className="text-white font-semibold">Settings</h3>
          </div>
        </div>
      </div>
      <div className="w-3/4 p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button className="bg-blue-400 p-2 rounded-full mr-4">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0h3m-3 0v3m0 0v3m0-3h3m-3 0h3" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold">Home</h2>
          </div>
          <div className="flex items-center">
            <h3 className="text-base font-semibold mr-4">
              Welcome, Dr Amritha K A
            </h3>
            <div className="flex items-center">
              <div className="bg-blue-400 p-3 rounded-md mr-4">
                <h3 className="text-white font-semibold">Appointments</h3>
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="bg-blue-400 p-3 rounded-md">
                <h3 className="text-white font-semibold">Rating</h3>
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 001.45.526c.31.31.558.7.733 1.166l.707.707c.29.29.52.7.7.992l.707.707a1 1 0 001.165.733c.31.31.7.558 1.166.733l4.674 1.519c.921.3.921 1.603 0 1.902l-4.674 1.519a1 1 0 00-.733 1.166c-.31.31-.7.558-.992.7l-.707.707c-.29.29-.7.52-.992.7l-.707.707a1 1 0 00-.733 1.166c-.31.31-.558.7-.733 1.166l-1.519 4.674c-.3.921-.921 1.603-1.902 0l-4.674-1.519a1 1 0 00-1.166-.733c-.31-.31-.7-.558-.992-.7l-.707-.707c-.29-.29-.52-.7-.7-.992l-.707-.707a1 1 0 00-1.165-.733c-.31-.31-.7-.558-.992-.7l-4.674-1.519c-.921-.3-.921-1.603 0-1.902l1.519-4.674a1 1 0 00-.526-1.45c-.31-.31-.7-.558-.992-.7l-.707-.707c-.29-.29-.52-.7-.7-.992l-.707-.707a1 1 0 00-1.166-.733c-.31-.31-.558-.7-.733-1.166l-1.519-4.674zm10.49 19.568l.707.707c.29.29.7.52.992.7l.707.707c.29.29.52.7.7.992l.707.707a1 1 0 001.165.733c.31.31.7.558 1.166.733l4.674 1.519c.921.3.921 1.603 0 1.902l-4.674 1.519a1 1 0 00-.733 1.166c-.31.31-.7.558-.992.7l-.707.707c-.29.29-.7.52-.992.7l-.707.707a1 1 0 00-1.166.733c-.31.31-.558.7-.733 1.166l-1.519 4.674c-.3.921-.921 1.603-1.902 0l-4.674-1.519a1 1 0 00-1.166-.733c-.31-.31-.7-.558-.992-.7l-.707-.707c-.29-.29-.52-.7-.7-.992l-.707-.707a1 1 0 00-1.165-.733c-.31-.31-.7-.558-.992-.7l-4.674-1.519c-.921-.3-.921-1.603 0-1.902l1.519-4.674a1 1 0 00.526-1.45c.31-.31.7-.558.992-.7l.707-.707c.29-.29.7-.52.992-.7l.707-.707a1 1 0 00.733-1.166c.31-.31.558-.7.733-1.166l1.519-4.674c.3-.921 1.603-.921 1.902 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-md">
          <h2 className="text-2xl font-bold mb-4">Appointments</h2>
          <div className="flex justify-between mb-4">
            <button className="bg-gray-200 p-2 rounded-md">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center">
              <div className="bg-gray-200 p-2 rounded-md mr-2">
                <h3 className="text-sm font-semibold">Today</h3>
                <div className="text-xs text-gray-500">4 slots remaining</div>
              </div>
              <div className="bg-gray-200 p-2 rounded-md mr-2">
                <h3 className="text-sm font-semibold">Tomorrow</h3>
                <div className="text-xs text-gray-500">32 slots Available</div>
              </div>
              <div className="bg-gray-200 p-2 rounded-md">
                <h3 className="text-sm font-semibold">Thu, 8 Aug</h3>
                <div className="text-xs text-gray-500">32 slots Available</div>
              </div>
            </div>
            <button className="bg-gray-200 p-2 rounded-md">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <button className="bg-green-200 p-3 rounded-md">04:00 PM</button>
            <button className="bg-green-200 p-3 rounded-md">05:00 PM</button>
            <button className="bg-green-200 p-3 rounded-md">06:00 PM</button>
            <button className="bg-green-200 p-3 rounded-md">07:00 PM</button>
            <button className="bg-green-200 p-3 rounded-md">08:00 PM</button>
            <button className="bg-green-200 p-3 rounded-md">09:00 PM</button>
            <button className="bg-green-200 p-3 rounded-md">10:00 PM</button>
            <button className="bg-green-200 p-3 rounded-md">11:00 PM</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorHome
