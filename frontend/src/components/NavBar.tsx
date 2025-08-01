
interface NavBarProps {
    onCustomerClick: () => void;
    onProductsClick: () => void;
}

export const NavBar = ({onCustomerClick, onProductsClick}: NavBarProps) => {
    return (
        <div className={"flex"}>
            <p className={"mr-2 ml-2"} onClick={onCustomerClick}>customers</p>
            <p onClick={onProductsClick}>products</p>
        </div>
    );
};

