import Vue from "vue";
import Vant from "vant";
import {Lazyload} from "vant";
import "vant/lib/index.css";

Vue.use(Vant);
Vue.use(Lazyload);

Vue.prototype.baseUrl = 'http://127.0.0.1';

Vue.filter("money", function (value) {
  let val = parseFloat(value);
  if (isNaN(val)) {
    return val;
  } else {
    return `￥${val.toFixed(2)}`;
  }
});
