export const utils = {
    isEmpty: function (someVar) {
        if (someVar == "" || someVar == null || someVar == undefined || someVar == {}) {
            return true
        } else {
            return false
        }
    },
    isEmptyObject: function (obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    },
    isSubstringOfOther(str1, str2) {
        str1 = str1.toLowerCase()
        str2 = str2.toLowerCase()

        return str1.substring(0, str2.length) == str2 || str2.substring(0, str1.length) == str1
    },
    cloneObjArray(objArray) {
        return objArray.map(obj => ({ ...obj })) 
    }
}