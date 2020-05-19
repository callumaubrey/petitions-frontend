const Helpers = {
    install(Vue, options) {
        Vue.prototype.$isLoggedIn = function () {
            if (Vue.$cookies.get('Token') !== null) return true;
            return false;
        };

        Vue.prototype.$getLoggedInToken = function () {
            return Vue.$cookies.get('Token');
        };

        Vue.prototype.$getLoggedInUserId = function () {
            return Vue.$cookies.get('UserId');
        };

        /*Vue.prototype.$getUserImage = function (id, callback) {
            Vue.axios.get('http://localhost:4941/api/v1/users/' + id + '/photo', { responseType: 'blob' })
            .then((res) => {
                let reader = new FileReader();
                reader.readAsDataURL(res.data);
                reader.onload = () => {
                    callback(reader.result);
                }
            })
            .catch(err => {
                callback(false);
            });
        };*/

        Vue.prototype.$getPetitionImage = function (id, callback) {
            Vue.axios.get('http://localhost:4941/api/v1/petitions/' + id + '/photo', { responseType: 'blob' })
            .then((res) => {
                let reader = new FileReader();
                reader.readAsDataURL(res.data);
                reader.onload = () => {
                    callback(reader.result);
                }
            })
            .catch(err => {
                // So we can set a default image
                return false;
            });
        };

        Vue.prototype.$getFormattedDate = function (date) {
            let options = {  year: 'numeric', month: 'long', day: 'numeric' };
            let dateObj  = new Date(date);
            return dateObj.toLocaleDateString("en-US", options);
        };

        Vue.prototype.$getYearMonthDayDate = function (date) {
            let d = new Date(date);
            if (date == null) {
                d = new Date();
            }
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            let year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        }
    }
};

export default Helpers;
