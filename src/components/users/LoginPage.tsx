import MyButton from '../common/button';
import Header from './Header';

const LoginPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-blue-100">
      <Header />
      <MyButton />
      <div className="main-background container mx-auto flex flex-col md:flex-row justify-center items-center mt-8 p-4 bg-white rounded-lg">
        <div className="w-full md:w-1/2 p-4 lg:ms-5">
          <img
            src="/doctor1.jpg"
            alt="Doctor"
            className="rounded-lg shadow-lg md:min-h-96 md:my-28 lg:my-24 xl:my-10 2xl:my-0"
          />
        </div>
        <div className="w-full md:w-1/2 p-8  rounded-lg ">
          <div className=" 2xl:w-10/12 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Email/Phone no"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-right mb-4">
                <a href="#" className="text-blue-500">
                  Forgot password?
                </a>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                Login
              </button>
            </form>
            <p className="mt-6 text-center text-gray-600">
              Are you a doctor?{' '}
              <a href="#" className="text-blue-500">
                Click here to login.
              </a>
            </p>
            <p className="mt-2 text-center text-gray-600">
              New to MeetDoc?{' '}
              <a href="#" className="text-blue-500">
                Register here.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
