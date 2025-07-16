import { NavLink } from 'react-router-dom';
import logo from '../../assets/react.svg';
import Swal from 'sweetalert2';
import { getLoggedInUser } from '../../utils/auth';

export default function Sidebar() {
  const user = getLoggedInUser();

  const nama = user?.nama || '';
  const roleId = user?.role || '';
  const role = roleId === 1 ? 'Admin' : 'User';
  const hadleLogOut = () => {
    Swal.fire({
      title: 'Logout',
      text: 'Apakah anda yakin ingin logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Batal',
    })
      .then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('token');
          window.location.href = '/';
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div
      className="flex flex-col flex-shrink-0 p-4 bg-gray-900 text-white w-[250px] h-screen"
    >
      <a
        href="/dashboard"
        className="flex items-center mb-4 no-underline text-white"
      >
        <img
          src={logo}
          alt="Logo"
          className="rounded-full mr-2 w-[50px] h-[50px]"
        />
        <span className="text-2xl font-semibold">Vehicle Rental</span>
      </a>
      <hr className="border-gray-700 mb-4" />
      {roleId === 1 ? (
        <ul className="flex flex-col gap-2 mb-auto">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? 'block px-3 py-2 rounded bg-sky-600 text-white'
                  : 'block px-3 py-2 rounded hover:bg-gray-800 hover:text-white'
              }
            >
              <i className='fa-solid fa-gauge me-2'></i>Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive
                  ? 'block px-3 py-2 rounded bg-sky-600 text-white'
                  : 'block px-3 py-2 rounded hover:bg-gray-800 hover:text-white'
              }
            >
              <i className='fa-solid fa-user-group me-2'></i>List Pengguna
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/vehicle"
              className={({ isActive }) =>
                isActive
                  ? 'block px-3 py-2 rounded bg-sky-600 text-white'
                  : 'block px-3 py-2 rounded hover:bg-gray-800 hover:text-white'
              }
            >
              <i className='fa-solid fa-car me-2'></i>List Kendaraan
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/rental"
              className={({ isActive }) =>
                isActive
                  ? 'block px-3 py-2 rounded bg-sky-600 text-white'
                  : 'block px-3 py-2 rounded hover:bg-gray-800 hover:text-white'
              }
            >
              <i className='fa-solid fa-handshake me-2'></i>Riwayat Penyewaan
            </NavLink>
          </li>
        </ul>
      ) : (
        <ul className="flex flex-col gap-2 mb-auto">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? 'block px-3 py-2 rounded bg-sky-600 text-white'
                  : 'block px-3 py-2 rounded hover:bg-gray-800 hover:text-white'
              }
            >
              <i className='fa-solid fa-gauge me-2'></i>Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/listvehicle"
              className={({ isActive }) =>
                isActive
                  ? 'block px-3 py-2 rounded bg-sky-600 text-white'
                  : 'block px-3 py-2 rounded hover:bg-gray-800 hover:text-white'
              }
            >
              <i className='fa-solid fa-car me-2'></i>Daftar Kendaraan
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/rentaluser"
              className={({ isActive }) =>
                isActive
                  ? 'block px-3 py-2 rounded bg-sky-600 text-white'
                  : 'block px-3 py-2 rounded hover:bg-gray-800 hover:text-white'
              }
            >
              <i className='fa-solid fa-handshake me-2'></i>Ajukan Penyewaan
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/payment"
              className={({ isActive }) =>
                isActive
                  ? 'block px-3 py-2 rounded bg-sky-600 text-white'
                  : 'block px-3 py-2 rounded hover:bg-gray-800 hover:text-white'
              }
            >
              <i className='fa-solid fa-hand-holding-dollar me-2'></i>Pembayaran
            </NavLink>
          </li> */}
        </ul>
      )
      }

      <div className="flex items-center gap-4 bg-gray-900 rounded px-2">
        <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white text-lg font-bold">
          <i className='fa-solid fa-user'></i>
        </div>
        <div>
          <div className="font-semibold">{nama}</div>
          <div className="text-sm text-gray-300">{role}</div>
        </div>
      </div>
      <hr className="border-gray-700 my-4" />
      <button className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded cursor-pointer" onClick={hadleLogOut}>
        <i className='fa-solid fa-right-from-bracket me-2'></i>Logout
      </button>
    </div>
  );
}
