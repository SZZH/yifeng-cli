import React from 'react';

import Login from './Components/Login';
import styles from './index.less';

const App = () => {
  return (
    <>
      <Login className={styles['box']}/>
    </>
  )
}

export default App;