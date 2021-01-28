import React from 'react';
import { Link } from 'react-router-dom';

import styles from './index.css';

const menus = [{
  name: '相关',
  url: '/about',
}, {
  name: '主页',
  url: '/',
}, {
  name: '实时数据',
  url: '/data',
}]

export default function () {
  return (
    <header className={styles.container}>
      {menus.map(i => (
        <Link className={styles.link} key={i.name} to={i.url}>
          {i.name}
        </Link>
      ))}
    </header>
  )
}