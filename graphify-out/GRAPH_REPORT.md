# Graph Report - viter-graces  (2026-09-01)

## Corpus Check
- 467 files · ~400,363 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1564 nodes · 4698 edges · 260 communities (229 shown, 31 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 431 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f1feaa79`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PesoSign.jsx
- core/functions.php
- returnError
- logError
- checkQuery
- sales-order/functions.php
- ReportSalesOrder
- checkExistence
- StoreContext.jsx
- User
- Products
- ProductOwner
- isEmptyItem
- Suppliers
- Customer
- Role
- SMTP
- Returns
- SuppliersPurchaseOrder
- useQueryData
- PHPMailer
- SuppliersProduct
- Dashboard.jsx
- product-owner/functions.php
- StockMovement
- useDarkMode
- ActivityLog
- Overview
- StockOverview
- inventory-app (deployed service name)
- user/functions.php
- CreatePassword.jsx
- activity-log/functions.php
- customer/functions.php
- InfiniteSubTable.jsx
- developer/returns/functions.php
- Response
- AccountPayable
- account-receivable/functions.php
- suppliers/functions.php
- purchase-order/functions.php
- AccountReceivable
- SuppliersPurchaseMovement
- stock-overview/functions.php
- FinanceReturns
- CLAUDE.md
- role/functions.php
- CashSales
- Expenses
- SalesJournal
- Encryption
- cypress.config.cjs
- Dotenv\Dotenv
- config.jsx
- account-payable/functions.php
- purchase-order-movement/functions.php
- movement-history.cy.js

## God Nodes (most connected - your core abstractions)
1. `logError()` - 272 edges
2. `checkQuery()` - 140 edges
3. `isEmptyItem()` - 117 edges
4. `PHPMailer` - 116 edges
5. `StoreContext` - 107 edges
6. `setError()` - 66 edges
7. `setMessage()` - 63 edges
8. `queryData()` - 58 edges
9. `useQueryData()` - 57 edges
10. `ProductOwnerId()` - 57 edges

## Surprising Connections (you probably didn't know these)
- `inventory-app (deployed service name)` --semantically_similar_to--> `Graces Portal (app title)`  [INFERRED] [semantically similar]
  app.yaml → index.html
- `checkReadByLimit()` --calls--> `checkQuery()`  [INFERRED]
  rest/v1/controllers/developer/activity-log/functions.php → rest/v1/core/functions.php
- `checkCreateWalkInCustomer()` --calls--> `checkQuery()`  [INFERRED]
  rest/v1/controllers/developer/activity-log/functions.php → rest/v1/core/functions.php
- `checkCreateOtherSupplier()` --calls--> `checkQuery()`  [INFERRED]
  rest/v1/controllers/developer/activity-log/functions.php → rest/v1/core/functions.php
- `isUserAccountAssociated()` --calls--> `checkExistence()`  [INFERRED]
  rest/v1/controllers/developer/customer/functions.php → rest/v1/core/functions.php

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Project identity across README, deployment config, and entry HTML** — readme, app_yaml_inventory_app, index_html_graces_portal [INFERRED 0.70]

## Communities (260 total, 31 thin omitted)

### Community 0 - "PesoSign.jsx"
Cohesion: 0.09
Nodes (43): ActionButton(), CloseButton(), AmountsWithPesoSign(), AmountWithPesoSign(), Pills(), ActionButtonMobile(), ActionButtonSubTable(), ActionButtonTable() (+35 more)

### Community 1 - "core/functions.php"
Cohesion: 0.04
Nodes (42): Firebase\JWT\JWT, checkActive(), checkApprove(), checkDecline(), checkDelete(), checkFilterByStatus(), checkFilterByStatusAndSearch(), checkFilterDate() (+34 more)

### Community 2 - "returnError"
Cohesion: 0.06
Nodes (46): Aws\Exception\AwsException, Aws\S3\S3Client, Google\Client, Google\Service\Drive, Database, checkDbConnection(), returnError(), checkDeleteGoogleDriveApiFiles() (+38 more)

### Community 4 - "checkQuery"
Cohesion: 0.09
Nodes (38): checkReadExpensesPerMonth(), checkReadExpensesPerWeek(), checkReadExpensesPerYear(), checkReadSalesPerMonth(), checkReadSalesPerWeek(), checkReadSalesPerYear(), checkReadAllAP(), checkReadAllAR() (+30 more)

### Community 5 - "sales-order/functions.php"
Cohesion: 0.07
Nodes (32): checkCreateInstallment(), checkCreateMovementStock(), checkCreateSalesJornal(), checkCreateSalesJournalRemoved(), checkDeleteById(), checkDeleteInstallment(), checkDeleteinstallmentById(), checkDeleteSalesJournal() (+24 more)

### Community 7 - "checkExistence"
Cohesion: 0.09
Nodes (17): isUserAccountAssociated(), checkCreateMovementStock(), checkDeleteMovementStock(), checkReadAllActive(), checkReadAllActiveByName(), checkReadAllCategory(), checkReadAllThatHaveStock(), isAssociatedWithOtherModule() (+9 more)

### Community 8 - "StoreContext.jsx"
Cohesion: 0.12
Nodes (60): App(), InputPhotoUpload(), InputSelect(), ProductOwnerInputSelectTagArray(), SearchableSelectFilter(), SearchableSelectFilterProductOwner(), SearchableSelectFilterStatus(), Toast() (+52 more)

### Community 12 - "isEmptyItem"
Cohesion: 0.11
Nodes (69): ExportCSVButton(), ModalButton(), InputCheckbox(), InputRadioButton(), DefaultInputSelectTagArray(), InputSalesOrderSelectTagArray(), InputSelectArray(), InputSelectArrayWithOptions() (+61 more)

### Community 16 - "SMTP"
Cohesion: 0.07
Nodes (8): Exception, SMTP, sendEmail(), getHtmlResetPassword(), getHtmlVerifyAccount(), getHtmlVerifyEmail(), sendEmail(), sendEmailVerify()

### Community 19 - "useQueryData"
Cohesion: 0.23
Nodes (12): FinanceStats(), InputPurchaseOrderSelectTagArray(), InputSelectCustomerArray(), InputSelectTagArray(), SearchableSelectModalFilter(), apiVersion, DashboardLowStockAlert(), ReportLowStockItems() (+4 more)

### Community 23 - "Dashboard.jsx"
Cohesion: 0.23
Nodes (11): NoData(), ServerError(), TableLoading(), StatCard(), DashboardExpensesToday(), DashboardOverduePayments(), DashboardRecentActivities(), DashboardSalesToday() (+3 more)

### Community 24 - "product-owner/functions.php"
Cohesion: 0.23
Nodes (9): checkReadByProductOwner(), checkReadByProductOwnerLimit(), checkReadByReceivedBy(), checkUpdateActivityLog(), checkUpdateProducts(), checkUpdatePurchaseOrder(), checkUpdateSalesOrder(), checkUpdateSuppliersProduct() (+1 more)

### Community 26 - "useDarkMode"
Cohesion: 0.17
Nodes (15): dashboardData, DashboardOverview(), salesData, GraphTooltip(), PesoSign(), ProfitLossChart(), profitLossData, SalesVsExpensesVsProfit() (+7 more)

### Community 30 - "inventory-app (deployed service name)"
Cohesion: 0.25
Nodes (7): Dockerfile, inventory-app (deployed service name), web service definition, Graces Portal (app title), main.jsx module entry script, inline theme (dark/light) init script, viter-graces (README)

### Community 31 - "user/functions.php"
Cohesion: 0.33
Nodes (7): checkAssociatedByActivityLog(), checkAssociatedByMenu(), checkAssociatedByProducts(), checkResetPasswordByEmail(), checkUpdateActivityLog(), checkUpdateProducts(), updateConnectedMenu()

### Community 32 - "CreatePassword.jsx"
Cohesion: 0.09
Nodes (35): LogoFull(), LogoFullSm(), InputLogin(), ButtonSpinner(), FetchingSpinner(), ScreenSpinner(), devNavUrl, UrlAdmin (+27 more)

### Community 33 - "activity-log/functions.php"
Cohesion: 0.29
Nodes (6): checkCreateOtherSupplier(), checkCreateWalkInCustomer(), checkReadByLimit(), createActivityLog(), createActivityLogWithPhp(), checkCreate()

### Community 34 - "customer/functions.php"
Cohesion: 0.25
Nodes (5): checkReadAllActive(), checkReadAllOpenBalance(), checkReadAllOverdueBalance(), checkReadWalkInCustomer(), isUserAccountAssociated()

### Community 35 - "InfiniteSubTable.jsx"
Cohesion: 0.12
Nodes (21): AddButton(), DateFormat(), LoadImages(), ExportModal(), SearchBar(), ExportProgressWidget(), OverviewSalesCustomer(), MobileResponsiveList() (+13 more)

### Community 37 - "developer/returns/functions.php"
Cohesion: 0.29
Nodes (4): checkCreateMovementStock(), checkReadAllActiveByName(), checkReadAllThatHaveStock(), isUserAccountAssociated()

### Community 41 - "account-receivable/functions.php"
Cohesion: 0.40
Nodes (4): checkCreateSalesJornal(), checkReadAllSales(), checkReadLastSalesJournal(), checkUpdateSales()

### Community 42 - "suppliers/functions.php"
Cohesion: 0.25
Nodes (7): checkAssociatedInPurchaseOrderById(), checkCreateProduct(), checkDeleteSupplierProduct(), checkReadSupplierInModal(), checkUpdateProductSupplier(), isUserAccountAssociated(), updateConnectedMenu()

### Community 43 - "purchase-order/functions.php"
Cohesion: 0.33
Nodes (3): checkDeleteById(), checkReadExpensesToday(), isUserAccountAssociated()

### Community 47 - "stock-overview/functions.php"
Cohesion: 0.33
Nodes (4): checkReadAllLowStock(), checkReadByUserIdLowStock(), checkReadCountLowStock(), isUserAccountAssociated()

### Community 51 - "role/functions.php"
Cohesion: 0.50
Nodes (3): checkUpdateUserAccountRole(), isUserAccountAssociated(), updateConnectedMenu()

### Community 64 - "config.jsx"
Cohesion: 0.13
Nodes (16): TableSpinner(), devBaseImgUrl, devBaseUrl, devKey, devWebUrl, googleHDViewLink, googleThumbnailLink, googleViewLink (+8 more)

## Knowledge Gaps
- **20 isolated node(s):** `{ defineConfig }`, `salesData`, `dashboardData`, `profitLossData`, `urlPath` (+15 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `logError()` connect `logError` to `core/functions.php`, `returnError`, `ReportSalesOrder`, `User`, `Products`, `ProductOwner`, `Suppliers`, `Customer`, `Role`, `Returns`, `SuppliersPurchaseOrder`, `SuppliersProduct`, `StockMovement`, `ActivityLog`, `Overview`, `StockOverview`, `AccountPayable`, `AccountReceivable`, `SuppliersPurchaseMovement`, `FinanceReturns`, `CashSales`, `Expenses`, `SalesJournal`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `checkQuery()` connect `checkQuery` to `account-payable/functions.php`, `activity-log/functions.php`, `customer/functions.php`, `purchase-order-movement/functions.php`, `developer/returns/functions.php`, `sales-order/functions.php`, `checkExistence`, `core/functions.php`, `account-receivable/functions.php`, `suppliers/functions.php`, `purchase-order/functions.php`, `stock-overview/functions.php`, `role/functions.php`, `product-owner/functions.php`, `user/functions.php`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `returnError()` connect `returnError` to `core/functions.php`, `logError`, `AccountReceivable`, `SuppliersPurchaseMovement`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Are the 271 inferred relationships involving `logError()` (e.g. with `.create()` and `.delete()`) actually correct?**
  _`logError()` has 271 INFERRED edges - model-reasoned connections that need verification._
- **Are the 111 inferred relationships involving `checkQuery()` (e.g. with `checkCreateOtherSupplier()` and `checkCreateWalkInCustomer()`) actually correct?**
  _`checkQuery()` has 111 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ defineConfig }`, `salesData`, `dashboardData` to the rest of the system?**
  _20 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PesoSign.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08888888888888889 - nodes in this community are weakly interconnected._