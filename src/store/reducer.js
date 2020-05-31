//state:所有数据信息

const defaultState = {
    items:[]
}
//设置state的默认数据:defaultState
export default (state = defaultState, action) => {
    if (action.type==='addItem') {
        let newState=JSON.parse(JSON.stringify(state)) //深度拷贝state
        var newItem = {
            text: action.text,
            key: Date.now()
        };
        newState.items.push(newItem)
        return newState
    }
    if (action.type==='deleteItem') {
        let newState=JSON.parse(JSON.stringify(state)) //深度拷贝state
        var filteredItems_temp = newState.items.filter(function (item) {
            return (item.key !== action.key);
        });
        var filteredItems = {
            items:filteredItems_temp
        }
        return filteredItems
    }
    return state;
}