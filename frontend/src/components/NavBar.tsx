
interface NavBarProps {
    onCustomerClick: () => void;
    onProductsClick: () => void;
    onOrdersClick: () => void;
}

export const NavBar = ({onCustomerClick, onProductsClick, onOrdersClick}: NavBarProps) => {
    return (
        <div className={"flex"}>
            <p className="mr-2 ml-2" onClick={onCustomerClick}>customers</p>
            <p className="mr-2" onClick={onProductsClick}>products</p>
            <p onClick={onOrdersClick}>orders</p>
        </div>
    );
};

