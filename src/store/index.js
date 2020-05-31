import { createStore } from 'redux';
import reducer from './reducer';

//创建store并且传递把reducer传递进来
const store = createStore(reducer);
export default store;