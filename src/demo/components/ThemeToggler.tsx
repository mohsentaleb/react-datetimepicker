import clsx from 'clsx';
import { useDarkMode } from 'usehooks-ts';

import MoonIcon from '../../../public/moon.svg?react';
import SunIcon from '../../../public/sun.svg?react';

function ThemeToggler() {
  const { isDarkMode, toggle } = useDarkMode();

  document.body.className = isDarkMode ? 'dark' : 'light';

  return (
    <div
      role="checkbox"
      className={clsx('relative mr-3 flex h-5 w-11 cursor-pointer items-center rounded-full px-1.5', {
        'justify-end bg-gray-500': !isDarkMode,
        'bg-gray-700': isDarkMode,
      })}
      onClick={toggle}
    >
      <div
        className={clsx('absolute left-0.5 h-4 w-4 transform rounded-full bg-white duration-200 ease-out', {
          'translate-x-6': isDarkMode,
          'translate-x-0': !isDarkMode,
        })}
      ></div>
      {!isDarkMode && <SunIcon className="h-3 w-3" />}
      {isDarkMode && <MoonIcon className="h-3 w-3" />}
    </div>
  );
}

export default ThemeToggler;
