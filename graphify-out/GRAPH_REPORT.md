<<<<<<< HEAD
# Graph Report - viter-graces  (2026-10-27)

## Corpus Check
- 540 files · ~514,577 words
=======
# Graph Report - viter-graces  (2026-10-22)

## Corpus Check
- 540 files · ~514,311 words
>>>>>>> aeea1a75615bfe948dc7537db6a78a967ec99f5c
- Verdict: corpus is large enough that graph structure adds value.

## Summary
<<<<<<< HEAD
- 1910 nodes · 5910 edges · 304 communities (262 shown, 42 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 551 edges (avg confidence: 0.85)
=======
- 1958 nodes · 6546 edges · 311 communities (31 shown, 280 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 569 edges (avg confidence: 0.85)
>>>>>>> aeea1a75615bfe948dc7537db6a78a967ec99f5c
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `269ea31e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
<<<<<<< HEAD
- ref_react
- stock-overview/functions.php
- ref_lucide_react
- returnError
=======
- StoreContext.jsx
- DashboardCashflowChart.jsx
- ref_react
- AmountWithPesoSign
- google-api.php
>>>>>>> aeea1a75615bfe948dc7537db6a78a967ec99f5c
- core/functions.php
- SMTP
- PHPMailer
- ActivityLogDetailsModal.jsx
- logError
- checkQuery
- role/functions.php
- sales-order/functions.php
- ReportSalesOrder
- purchase-order/functions.php
- Products
- ProductOwner
- User
- Suppliers
- Customer
- Role
<<<<<<< HEAD
=======
- ref_lucide_react
>>>>>>> aeea1a75615bfe948dc7537db6a78a967ec99f5c
- SuppliersProduct
- product-owner/functions.php
- SuppliersPurchaseOrder
- products/functions.php
<<<<<<< HEAD
=======
- config.jsx
>>>>>>> aeea1a75615bfe948dc7537db6a78a967ec99f5c
- AccountReceivable
- StockMovement
- ActivityLog
- Overview
- StockOverview
- user/functions.php
- SuppliersPurchaseMovement
- activity-log/functions.php
- product/functions.php
- developer/returns/functions.php
- Response
- AccountPayable
- getResultData
- CashSales
- Expenses
- FinanceReturns
- SalesJournal
- purchase-order-movement/functions.php
- Encryption
- account-payable/functions.php
- finance/returns/functions.php
- CLAUDE.md
- cypress.config.cjs
- cash-sales/functions.php
<<<<<<< HEAD
- stock-movement/functions.php
- InfiniteTable.jsx
- .setOAuth
- movement-history-filters.cy.js
- returns-filters.cy.js
- sales-orders-filters.cy.js
- stocks-overview-filters.cy.js
- eslint.config.js
- config.jsx
- ref_file
=======
- InfiniteFilterWithDropDown.jsx
- google-api-personal.php
- App.jsx
- google-api-dwd.php
- SpacesStorage
- ProtectedRouteUser.jsx
- returnError
>>>>>>> aeea1a75615bfe948dc7537db6a78a967ec99f5c
- suppliers/functions.php
- isEmptyItem
- customer/functions.php
- ref_react_icons

## God Nodes (most connected - your core abstractions)
1. `logError()` - 334 edges
2. `checkQuery()` - 187 edges
3. `isEmptyItem()` - 133 edges
<<<<<<< HEAD
4. `PHPMailer` - 116 edges
5. `StoreContext` - 110 edges
6. `setError()` - 66 edges
7. `ProductOwnerId()` - 66 edges
8. `setMessage()` - 63 edges
9. `useQueryData()` - 62 edges
10. `queryData()` - 58 edges
=======
4. `PHPMailer` - 119 edges
5. `StoreContext` - 109 edges
6. `AmountWithPesoSign()` - 85 edges
7. `InfiniteTable()` - 76 edges
8. `HeaderNav()` - 68 edges
9. `setError()` - 66 edges
10. `ProductOwnerId()` - 65 edges
>>>>>>> aeea1a75615bfe948dc7537db6a78a967ec99f5c

## Surprising Connections (you probably didn't know these)
- `checkReadByLimit()` --calls--> `checkQuery()`  [INFERRED]
  rest/v1/controllers/developer/activity-log/functions.php → rest/v1/core/functions.php
- `checkSupplierDescription()` --calls--> `checkQuery()`  [INFERRED]
  rest/v1/controllers/developer/activity-log/functions.php → rest/v1/core/functions.php
- `checkCreateWalkInCustomer()` --calls--> `checkQuery()`  [INFERRED]
  rest/v1/controllers/developer/activity-log/functions.php → rest/v1/core/functions.php
- `checkCreateOtherSupplier()` --calls--> `checkQuery()`  [INFERRED]
  rest/v1/controllers/developer/activity-log/functions.php → rest/v1/core/functions.php
- `checkReadAllActivityLogMenu()` --calls--> `checkQuery()`  [INFERRED]
  rest/v1/controllers/developer/activity-log/functions.php → rest/v1/core/functions.php

## Import Cycles
- 3-file cycle: `src/layout/mobile-responsive/MobileResponsiveList.jsx -> src/layout/mobile-responsive/SuppliersMobileResponsive.jsx -> src/layout/table/InfiniteSubTable.jsx -> src/layout/mobile-responsive/MobileResponsiveList.jsx`
- 4-file cycle: `src/layout/mobile-responsive/ActivityLogMobileResponsive.jsx -> src/pages/developer/reports/activity-log/ActivityLog.jsx -> src/layout/table/InfiniteTable.jsx -> src/layout/mobile-responsive/MobileResponsiveList.jsx -> src/layout/mobile-responsive/ActivityLogMobileResponsive.jsx`

<<<<<<< HEAD
## Communities (304 total, 42 thin omitted)

### Community 0 - "ref_react"
Cohesion: 0.07
Nodes (91): ref_react, ref_react_select, FinanceStats(), DATE_OPS, DateOperatorFilter(), DropdownFilter(), NO_VALUE_OPS, NUMBER_OPS (+83 more)

### Community 1 - "stock-overview/functions.php"
Cohesion: 0.33
Nodes (4): checkReadAllLowStock(), checkReadByUserIdLowStock(), checkReadCountLowStock(), isUserAccountAssociated()

### Community 3 - "ref_lucide_react"
Cohesion: 0.08
Nodes (52): ref_lucide_react, ref_react_dom, ActionButton(), CloseButton(), AmountsWithPesoSign(), AmountWithPesoSign(), Pills(), ActionButtonMobile() (+44 more)

### Community 4 - "returnError"
Cohesion: 0.06
Nodes (46): Aws\Exception\AwsException, Aws\S3\S3Client, Google\Client, Google\Service\Drive, Database, checkDbConnection(), returnError(), checkDeleteGoogleDriveApiFiles() (+38 more)

### Community 5 - "core/functions.php"
Cohesion: 0.04
Nodes (50): Firebase\JWT\JWT, isItemAssociatedWithReturn(), isOrderAssociatedWithReturn(), isOrderCreatedByOtherOwner(), isQtyChangeAssociatedWithReturn(), isUserAccountAssociated(), checkActive(), checkApprove() (+42 more)

### Community 6 - "SMTP"
Cohesion: 0.07
Nodes (8): Exception, SMTP, sendEmail(), getHtmlResetPassword(), getHtmlVerifyAccount(), getHtmlVerifyEmail(), sendEmail(), sendEmailVerify()
=======
## Communities (311 total, 280 thin omitted)

### Community 0 - "StoreContext.jsx"
Cohesion: 0.11
Nodes (80): DATE_OPS, DateOperatorFilter(), DropdownFilter(), NO_VALUE_OPS, NUMBER_OPS, NumberOperatorFilter(), OperatorFilter(), TEXT_OPS (+72 more)

### Community 1 - "DashboardCashflowChart.jsx"
Cohesion: 0.23
Nodes (14): dashboardData, DashboardOverview(), salesData, GraphTooltip(), MiniStatCard(), PesoSign(), ProfitLossChart(), profitLossData (+6 more)

### Community 2 - "ref_react"
Cohesion: 0.10
Nodes (9): LogoFullSm(), devNavUrl, titleHeaderTab(), TitleHeader(), getNavList(), Navigation(), SearchBar(), setIsNavFullShow() (+1 more)

### Community 3 - "AmountWithPesoSign"
Cohesion: 0.09
Nodes (55): ActionButton(), CloseButton(), DemoLimitModal(), AmountsWithPesoSign(), AmountWithPesoSign(), Pills(), ActionButtonMobile(), ActionButtonSubTable() (+47 more)

### Community 4 - "google-api.php"
Cohesion: 0.19
Nodes (13): checkDeleteGoogleDriveApiFiles(), checkFileInput(), checkFolderIfExistOrCreate(), checkToUploadGoogleDrive(), createFolder(), deleteGoogleFileByFileId(), fileUploadToGoogleDriveWithPublicPermission(), getClientService() (+5 more)

### Community 5 - "core/functions.php"
Cohesion: 0.04
Nodes (48): isItemAssociatedWithReturn(), isOrderAssociatedWithReturn(), isQtyChangeAssociatedWithReturn(), isUserAccountAssociated(), checkActive(), checkApprove(), checkAssociatedById(), checkAssociatedByName() (+40 more)
>>>>>>> aeea1a75615bfe948dc7537db6a78a967ec99f5c

### Community 8 - "ActivityLogDetailsModal.jsx"
Cohesion: 0.11
Nodes (48): activityActionPillClass(), ActivityLogDetailsModal(), ArrayOfObjectsCards(), BOOLEAN_LIKE_VALUES, BooleanPill(), buildReturnSummary(), canonicalizeKey(), cleanEntries() (+40 more)

### Community 9 - "logError"
Cohesion: 0.05
Nodes (3): logError(), Returns, SalesOrder

### Community 10 - "checkQuery"
Cohesion: 0.09
Nodes (39): checkReadExpensesPerMonth(), checkReadExpensesPerWeek(), checkReadExpensesPerYear(), checkReadSalesPerMonth(), checkReadSalesPerWeek(), checkReadSalesPerYear(), checkReadAllAP(), checkReadAllAR() (+31 more)

### Community 11 - "role/functions.php"
Cohesion: 0.50
Nodes (3): checkUpdateUserAccountRole(), isUserAccountAssociated(), updateConnectedMenu()

### Community 12 - "sales-order/functions.php"
Cohesion: 0.07
Nodes (35): checkCreateInstallment(), checkCreateMovementStock(), checkCreateSalesJornal(), checkCreateSalesJournalRemoved(), checkDeleteById(), checkDeleteInstallment(), checkDeleteinstallmentById(), checkDeleteSalesJournal() (+27 more)

### Community 14 - "purchase-order/functions.php"
Cohesion: 0.25
Nodes (5): checkDeleteById(), checkItemsBelongToSupplier(), checkReadExpensesToday(), checkReadGoupByPurchaseOrderNumber(), isUserAccountAssociated()

<<<<<<< HEAD
=======
### Community 23 - "ref_lucide_react"
Cohesion: 0.17
Nodes (27): FinanceStats(), InputPurchaseOrderSelectTagArray(), InputSelectCustomerArray(), InputSelectTagArray(), SearchableSelectFilter(), SearchableSelectModalFilter(), NoData(), ServerError() (+19 more)

>>>>>>> aeea1a75615bfe948dc7537db6a78a967ec99f5c
### Community 25 - "product-owner/functions.php"
Cohesion: 0.17
Nodes (13): checkReadByCreatedBy(), checkReadByProductOwner(), checkReadByProductOwnerLimit(), checkReadByReceivedBy(), checkUpdateActivityLog(), checkUpdateProducts(), checkUpdatePurchaseOrder(), checkUpdateReturnProduct() (+5 more)

### Community 27 - "products/functions.php"
<<<<<<< HEAD
Cohesion: 0.14
Nodes (11): checkCreateMovementStock(), checkDeleteMovementStock(), checkReadAllActive(), checkReadAllActiveByName(), checkReadAllCategory(), checkReadAllSku(), checkReadAllThatHaveStock(), checkReadAllUnit() (+3 more)
=======
Cohesion: 0.07
Nodes (18): checkReadAllLocation(), checkReadAllNotes(), isUserAccountAssociated(), checkReadAllLowStock(), checkReadByUserIdLowStock(), checkReadCountLowStock(), isUserAccountAssociated(), checkCreateMovementStock() (+10 more)

### Community 28 - "config.jsx"
Cohesion: 0.18
Nodes (11): devBaseImgUrl, devBaseUrl, devKey, devWebUrl, googleHDViewLink, googleThumbnailLink, googleViewLink, isDemoMode (+3 more)
>>>>>>> aeea1a75615bfe948dc7537db6a78a967ec99f5c

### Community 34 - "user/functions.php"
Cohesion: 0.19
Nodes (12): checkAssociatedByActivityLog(), checkAssociatedByMenu(), checkAssociatedByProducts(), checkReadGoupByEmail(), checkReadGoupByName(), checkReadGoupByProductOwner(), checkReadGoupByProductOwnerEmail(), checkReadGoupByRole() (+4 more)

### Community 36 - "activity-log/functions.php"
Cohesion: 0.17
Nodes (11): checkCreateOtherSupplier(), checkCreateWalkInCustomer(), checkReadAllActivityLogAction(), checkReadAllActivityLogMenu(), checkReadAllActivityLogRole(), checkReadAllActivityLogUser(), checkReadByLimit(), checkSupplierDescription() (+3 more)

### Community 37 - "product/functions.php"
Cohesion: 0.33
Nodes (4): checkReadGoupBySupplierProductItems(), checkReadGoupBySupplierProductUnit(), checkReadOtherSupplierByProductOwnerId(), isUserAccountAssociated()

### Community 39 - "developer/returns/functions.php"
Cohesion: 0.18
Nodes (8): checkCreateMovementStock(), checkDeleteReturnMovement(), checkReadAllActiveByName(), checkReadAllReturnedOrderNumbers(), checkReadAllReturnedProductNumbers(), checkReadAllReturnedProductReasons(), checkReadAllThatHaveStock(), isUserAccountAssociated()

### Community 42 - "getResultData"
Cohesion: 0.17
Nodes (14): applyCreditMemoForCollection(), applyOrderPaymentEffects(), checkCreateSalesJornal(), checkReadAllSales(), checkReadCashierAll(), checkReadCashierLimit(), checkReadLastSalesJournal(), checkUpdateSales() (+6 more)

<<<<<<< HEAD
### Community 53 - "vite.config.js"
Cohesion: 0.33
Nodes (4): ref_path, ref_tailwindcss_vite, ref_vite, ref_vitejs_plugin_react

### Community 68 - "stock-movement/functions.php"
Cohesion: 0.40
Nodes (3): checkReadAllLocation(), checkReadAllNotes(), isUserAccountAssociated()

### Community 71 - "InfiniteTable.jsx"
Cohesion: 0.06
Nodes (65): ref_recharts, ref_tanstack_react_table, AddButton(), ExportCSVButton(), dashboardData, DashboardOverview(), salesData, DateFormat() (+57 more)

### Community 119 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): ref_eslint_js, ref_eslint_plugin_react, ref_eslint_plugin_react_hooks, ref_eslint_plugin_react_refresh, ref_globals

### Community 175 - "config.jsx"
Cohesion: 0.06
Nodes (59): ref_react_router_dom, App(), LogoFull(), LogoFullSm(), InputLogin(), ButtonSpinner(), FetchingSpinner(), devBaseUrl (+51 more)
=======
### Community 66 - "InfiniteFilterWithDropDown.jsx"
Cohesion: 0.19
Nodes (19): AddButton(), DateFormat(), DebouncedInput(), LoadImages(), SearchBar(), TableSpinner(), OverviewSalesCustomer(), ActiveFilterTagBar() (+11 more)

### Community 67 - "google-api-personal.php"
Cohesion: 0.19
Nodes (13): checkDeleteGoogleDriveApiFiles(), checkFileInput(), checkFolderIfExistOrCreate(), checkToUploadGoogleDrive(), createFolder(), deleteGoogleFileByFileId(), fileUploadToGoogleDriveWithPublicPermission(), getClientService() (+5 more)

### Community 68 - "App.jsx"
Cohesion: 0.12
Nodes (16): App(), ExportModal(), ExportProgressWidget(), routesCashier, routesAccess, routesAdmin, routesDeveloper, routesProductOwner (+8 more)

### Community 72 - "google-api-dwd.php"
Cohesion: 0.23
Nodes (12): checkDeleteGoogleDriveApiFiles(), checkFileInput(), checkToUploadGoogleDrive(), deleteGoogleFileByFileId(), fileUploadToGoogleDriveWithPublicPermission(), getClientService(), getDirectoryPath(), getDriveFile() (+4 more)

### Community 175 - "ProtectedRouteUser.jsx"
Cohesion: 0.16
Nodes (13): FetchingSpinner(), ScreenSpinner(), UrlAdmin, UrlDeveloper, quickHeaderShortCut(), Header(), PageNotFound(), ProtectedRouteUser() (+5 more)

### Community 291 - "returnError"
Cohesion: 0.22
Nodes (3): Database, checkDbConnection(), returnError()
>>>>>>> aeea1a75615bfe948dc7537db6a78a967ec99f5c

### Community 294 - "suppliers/functions.php"
Cohesion: 0.13
Nodes (14): checkAssociatedInPurchaseOrderById(), checkCreateProduct(), checkCreateSupplierDescription(), checkDeleteSupplierProduct(), checkReadBySupplierDescriptionName(), checkReadGoupBySupplierAddress(), checkReadGoupBySupplierDescriptionName(), checkReadGoupBySupplierEmail() (+6 more)

### Community 295 - "isEmptyItem"
<<<<<<< HEAD
Cohesion: 0.09
Nodes (86): ref_exceljs, ref_formik, ref_get_blob_duration, ref_tanstack_react_query, ref_yup, ModalButton(), InputCheckbox(), InputPhotoUpload() (+78 more)
=======
Cohesion: 0.08
Nodes (95): LogoFull(), ExportCSVButton(), ModalButton(), InputCheckbox(), InputPhotoUpload(), InputRadioButton(), DefaultInputSelectTagArray(), InputSalesOrderSelectTagArray() (+87 more)
>>>>>>> aeea1a75615bfe948dc7537db6a78a967ec99f5c

### Community 299 - "customer/functions.php"
Cohesion: 0.18
Nodes (8): checkReadAllActive(), checkReadAllContact(), checkReadAllCustomers(), checkReadAllEmail(), checkReadAllOpenBalance(), checkReadAllOverdueBalance(), checkReadWalkInCustomer(), isUserAccountAssociated()

## Knowledge Gaps
- **31 isolated node(s):** `{ defineConfig }`, `salesData`, `dashboardData`, `profitLossData`, `TEXT_OPS` (+26 more)
<<<<<<< HEAD
  These have ≤1 connection - possible missing edges or undocumented components.
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.
=======
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 516 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **280 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.
>>>>>>> aeea1a75615bfe948dc7537db6a78a967ec99f5c

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

<<<<<<< HEAD
- **Why does `logError()` connect `logError` to `returnError`, `core/functions.php`, `ReportSalesOrder`, `Products`, `ProductOwner`, `User`, `Suppliers`, `Customer`, `Role`, `SuppliersProduct`, `SuppliersPurchaseOrder`, `AccountReceivable`, `StockMovement`, `ActivityLog`, `Overview`, `StockOverview`, `SuppliersPurchaseMovement`, `AccountPayable`, `CashSales`, `Expenses`, `FinanceReturns`, `SalesJournal`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `checkQuery()` connect `checkQuery` to `stock-overview/functions.php`, `core/functions.php`, `role/functions.php`, `sales-order/functions.php`, `purchase-order/functions.php`, `product-owner/functions.php`, `products/functions.php`, `user/functions.php`, `activity-log/functions.php`, `product/functions.php`, `suppliers/functions.php`, `developer/returns/functions.php`, `getResultData`, `customer/functions.php`, `purchase-order-movement/functions.php`, `account-payable/functions.php`, `finance/returns/functions.php`, `cash-sales/functions.php`, `stock-movement/functions.php`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `returnError()` connect `returnError` to `SuppliersPurchaseMovement`, `core/functions.php`, `logError`, `purchase-order/functions.php`, `AccountReceivable`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Are the 333 inferred relationships involving `logError()` (e.g. with `.create()` and `.createSupplierDescription()`) actually correct?**
  _`logError()` has 333 INFERRED edges - model-reasoned connections that need verification._
- **Are the 158 inferred relationships involving `checkQuery()` (e.g. with `checkCreateOtherSupplier()` and `checkCreateWalkInCustomer()`) actually correct?**
  _`checkQuery()` has 158 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ defineConfig }`, `salesData`, `dashboardData` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_react` be split into smaller, more focused modules?**
  _Cohesion score 0.0669504364764447 - nodes in this community are weakly interconnected._
=======
- **Why does `logError()` connect `logError` to `core/functions.php`, `ReportSalesOrder`, `Products`, `ProductOwner`, `User`, `Suppliers`, `Customer`, `Role`, `SuppliersProduct`, `SuppliersPurchaseOrder`, `AccountReceivable`, `StockMovement`, `ActivityLog`, `Overview`, `StockOverview`, `returnError`, `SuppliersPurchaseMovement`, `AccountPayable`, `CashSales`, `Expenses`, `FinanceReturns`, `SalesJournal`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **Are the 332 inferred relationships involving `logError()` (e.g. with `.create()` and `.createSupplierDescription()`) actually correct?**
  _`logError()` has 332 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ defineConfig }`, `salesData`, `dashboardData` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `StoreContext.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11050353155616313 - nodes in this community are weakly interconnected._
- **Why does `checkQuery()` connect `checkQuery` to `user/functions.php`, `activity-log/functions.php`, `product/functions.php`, `suppliers/functions.php`, `developer/returns/functions.php`, `core/functions.php`, `getResultData`, `customer/functions.php`, `sales-order/functions.php`, `role/functions.php`, `purchase-order/functions.php`, `purchase-order-movement/functions.php`, `account-payable/functions.php`, `finance/returns/functions.php`, `product-owner/functions.php`, `products/functions.php`, `cash-sales/functions.php`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Are the 158 inferred relationships involving `checkQuery()` (e.g. with `checkCreateOtherSupplier()` and `checkCreateWalkInCustomer()`) actually correct?**
  _`checkQuery()` has 158 INFERRED edges - model-reasoned connections that need verification._
- **Should `ref_react` be split into smaller, more focused modules?**
  _Cohesion score 0.1010752688172043 - nodes in this community are weakly interconnected._
>>>>>>> aeea1a75615bfe948dc7537db6a78a967ec99f5c
