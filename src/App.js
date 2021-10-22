import React from 'react';
import { Route, Router } from 'react-router';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import LoginPage from './component/pages/LoginPage';
import HistoryPage from './component/pages/history/HistoryPage';
import UsersManagementPage from './component/pages/employees/UsersManagementPage';
import history from './history';
import './App.css';
import styles from './styles';
import TransactionsDetail from './component/pages/stock/TransactionsDetail';
import ItemListPage from './component/pages/items/ItemListPage';
import UserDetail from './component/pages/employees/UserDetail';
import ExportStock from './component/pages/stock/export/ExportStockPage';
import AdjustmentStockPage from './component/pages/stock/adjustment/AdjustmentStockPage';
import CategoryListPage from './component/pages/items/category/CategoryListPage';
import DiscountListPage from './component/pages/items/discount/DiscountListPage';
import AddCategory from './component/pages/items/category/AddCategory';
import AddDiscount from './component/pages/items/discount/AddDiscount';
import ItemDetail from './component/pages/items/ItemDetail';
import ImportItems from './component/pages/stock/import/ImportItems';
import { RouteName } from './models/route_name';
import ImportStock from './component/pages/stock/import/ImportStockPage';
import ExportItems from './component/pages/stock/export/ExportItems';
import AdjustmentItems from './component/pages/stock/adjustment/AdjustmentItems';
import SaleSummary from './component/pages/reports/SaleSummaryReport';
import TaxReport from './component/pages/reports/TaxReport';
import DiscountReport from './component/pages/reports/DiscountReport';
import ReceiptReport from './component/pages/reports/ReceiptReport';
import PaymentReport from './component/pages/reports/PaymentReport';
import EmployeeReport from './component/pages/reports/EmployeeReport';
import CategoryReport from './component/pages/reports/CategoryReport';
import ItemRePort from './component/pages/reports/ItemReport';
import StockHomePage from './component/pages/stock/StockHomePage';

const theme = createMuiTheme(styles.global);

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router history={history}>
                <Route component={LoginPage} exact path={RouteName.LOGIN} />
                <Route component={StockHomePage} exact path={RouteName.STOCK} />
                <Route component={ImportStock} exact path={RouteName.IMPORT_LIST} />
                <Route component={ImportItems} exact path={RouteName.IMPORT_ITEMS} />
                <Route component={ExportStock} exact path={RouteName.EXPORT_LIST} />
                <Route component={ExportItems} exact path={RouteName.EXPORT_ITEMS} />
                <Route component={AdjustmentStockPage} exact path={RouteName.ADJUSTMENT_LIST} />
                <Route component={AdjustmentItems} exact path={RouteName.ADJUSTMENT_ITEMS} />
                <Route component={TransactionsDetail} exact path={RouteName.IMPORT_TRANSACTION} />
                <Route component={TransactionsDetail} exact path={RouteName.EXPORT_TRANSACTION} />
                <Route component={TransactionsDetail} exact path={RouteName.ADJUSTMENT_TRANSACTION} />
                <Route component={UsersManagementPage} exact path={RouteName.USERS} />
                <Route component={HistoryPage} exact path={RouteName.HISTORY} />
                <Route component={ItemListPage} exact path={RouteName.ITEMS} />
                <Route component={ItemDetail} exact path={RouteName.ITEM_DETAIL} />
                <Route component={CategoryListPage} exact path={RouteName.CATEGORIES} />
                <Route component={AddCategory} exact path={RouteName.CATEGORIES_DETAIL} />
                <Route component={DiscountListPage} exact path={RouteName.DISCOUNTS} />
                <Route component={AddDiscount} exact path={RouteName.DISCOUNTS_DETAIL} />
                <Route component={UserDetail} exact path={RouteName.USERS_DETAIL} />
                <Route component={SaleSummary} exact path={RouteName.SALE_SUMMARY} />
                <Route component={ItemRePort} exact path={RouteName.REPORT_ITEM} />
                <Route component={CategoryReport} exact path={RouteName.REPORT_CATEGORY} />
                <Route component={EmployeeReport} exact path={RouteName.REPORT_EMPLOYEE} />
                <Route component={PaymentReport} exact path={RouteName.REPORT_PAYMENT} />
                <Route component={ReceiptReport} exact path={RouteName.REPORT_RECEIPT} />
                <Route component={DiscountReport} exact path={RouteName.REPORT_DISCOUNT} />
                <Route component={TaxReport} exact path={RouteName.REPORT_TAX} />
            </Router>
        </ThemeProvider>
    );
}

export default App;
