

function MenuButton(props) {
    const {
        isMenuShown,
        onClick
    } = props;

    function handleClick() {
        onClick();
    }

    return (
        <div>
        {
            isMenuShown
                ? <button onClick={handleClick}>Close</button>
                : <button onClick={handleClick}>Show</button>
        }
        </div>
    )
}

export default MenuButton;