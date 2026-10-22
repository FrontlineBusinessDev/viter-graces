# Graph Report - viter-graces  (2026-10-01)

## Corpus Check
- 537 files · ~513,045 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 11, .conf 2, .woff2 2)

## Summary
- 1941 nodes · 5952 edges · 314 communities (36 shown, 278 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 569 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `526ca2ba`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- InfiniteTable.jsx
- DashboardCashflowChart.jsx
- config.jsx
- MobileResponsiveList.jsx
- google-api.php
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
- Exception
- Suppliers
- Customer
- Role
- useQueryData
- SuppliersProduct
- product-owner/functions.php
- SuppliersPurchaseOrder
- products/functions.php
- StoreContext
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
- vite.config.js
- CLAUDE.md
- cypress.config.cjs
- accounts-payable-filters.cy.js
- expenses-filters.cy.js
- movement-history.cy.js
- expenses-report.cy.js
- sales-reports.cy.js
- Dotenv\Dotenv
- cash-sales/functions.php
- ref_react
- google-api-personal.php
- ProtectedRouteUser.jsx
- ViewProducts.jsx
- google-api-dwd.php
- StoreContext.jsx
- SpacesStorage
- movement-history-filters.cy.js
- returns-filters.cy.js
- sales-orders-filters.cy.js
- stocks-overview-filters.cy.js
- eslint.config.js
- Header.jsx
- returnError
- suppliers/functions.php
- isEmptyItem
- customer/functions.php
- formatDate.jsx
- notifications/reset-password.php
- notifications/verify-account.php
- notifications/verify-email.php

## God Nodes (most connected - your core abstractions)
1. `logError()` - 333 edges
2. `checkQuery()` - 187 edges
3. `isEmptyItem()` - 133 edges
4. `PHPMailer` - 119 edges
5. `StoreContext` - 109 edges
6. `setError()` - 66 edges
7. `ProductOwnerId()` - 65 edges
8. `setMessage()` - 63 edges
9. `useQueryData()` - 62 edges
10. `queryData()` - 58 edges

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

## Communities (314 total, 278 thin omitted)

### Community 0 - "InfiniteTable.jsx"
Cohesion: 0.11
Nodes (73): ref_react_select, AmountRangeFilter(), DateRangeFilter(), dateRangeLabel(), MultiRangeAmountFilter(), MultiRangeDateFilter(), nextRangeId(), rangeLabel() (+65 more)

### Community 1 - "DashboardCashflowChart.jsx"
Cohesion: 0.18
Nodes (16): ref_recharts, dashboardData, DashboardOverview(), salesData, GraphTooltip(), MiniStatCard(), ProfitLossChart(), profitLossData (+8 more)

### Community 2 - "config.jsx"
Cohesion: 0.09
Nodes (24): ref_react_icons, LogoFullSm(), devBaseImgUrl, devBaseUrl, devKey, devNavUrl, devWebUrl, googleHDViewLink (+16 more)

### Community 3 - "MobileResponsiveList.jsx"
Cohesion: 0.07
Nodes (63): ref_tanstack_react_table, ActionButton(), AddButton(), DateFormat(), DebouncedInput(), AmountsWithPesoSign(), AmountWithPesoSign(), PesoSign() (+55 more)

### Community 4 - "google-api.php"
Cohesion: 0.19
Nodes (14): Google\Client, checkDeleteGoogleDriveApiFiles(), checkFileInput(), checkFolderIfExistOrCreate(), checkToUploadGoogleDrive(), createFolder(), deleteGoogleFileByFileId(), fileUploadToGoogleDriveWithPublicPermission() (+6 more)

### Community 5 - "core/functions.php"
Cohesion: 0.04
Nodes (49): Firebase\JWT\JWT, isItemAssociatedWithReturn(), isOrderAssociatedWithReturn(), isQtyChangeAssociatedWithReturn(), isUserAccountAssociated(), checkActive(), checkApprove(), checkAssociatedById() (+41 more)

### Community 8 - "ActivityLogDetailsModal.jsx"
Cohesion: 0.10
Nodes (44): ActivityLogDetailsModal(), ArrayOfObjectsCards(), BOOLEAN_LIKE_VALUES, BooleanPill(), buildReturnSummary(), canonicalizeKey(), cleanEntries(), DetailValue() (+36 more)

### Community 9 - "logError"
Cohesion: 0.06
Nodes (3): logError(), Returns, SalesOrder

### Community 10 - "checkQuery"
Cohesion: 0.09
Nodes (39): checkReadExpensesPerMonth(), checkReadExpensesPerWeek(), checkReadExpensesPerYear(), checkReadSalesPerMonth(), checkReadSalesPerWeek(), checkReadSalesPerYear(), checkReadAllAP(), checkReadAllAR() (+31 more)

### Community 11 - "role/functions.php"
Cohesion: 0.50
Nodes (3): checkUpdateUserAccountRole(), isUserAccountAssociated(), updateConnectedMenu()

### Community 12 - "sales-order/functions.php"
Cohesion: 0.06
Nodes (35): checkCreateInstallment(), checkCreateMovementStock(), checkCreateSalesJornal(), checkCreateSalesJournalRemoved(), checkDeleteById(), checkDeleteInstallment(), checkDeleteinstallmentById(), checkDeleteSalesJournal() (+27 more)

### Community 14 - "purchase-order/functions.php"
Cohesion: 0.20
Nodes (5): checkDeleteById(), checkItemsBelongToSupplier(), checkReadExpensesToday(), checkReadGoupByPurchaseOrderNumber(), isUserAccountAssociated()

### Community 23 - "useQueryData"
Cohesion: 0.15
Nodes (20): InputPurchaseOrderSelectTagArray(), InputSelectCustomerArray(), InputSelectTagArray(), SearchableSelectFilter(), SearchableSelectModalFilter(), StatCard(), OverviewSalesCustomer(), DashboardExpensesToday() (+12 more)

### Community 25 - "product-owner/functions.php"
Cohesion: 0.17
Nodes (13): checkReadByCreatedBy(), checkReadByProductOwner(), checkReadByProductOwnerLimit(), checkReadByReceivedBy(), checkUpdateActivityLog(), checkUpdateProducts(), checkUpdatePurchaseOrder(), checkUpdateReturnProduct() (+5 more)

### Community 27 - "products/functions.php"
Cohesion: 0.07
Nodes (18): checkReadAllLocation(), checkReadAllNotes(), isUserAccountAssociated(), checkReadAllLowStock(), checkReadByUserIdLowStock(), checkReadCountLowStock(), isUserAccountAssociated(), checkCreateMovementStock() (+10 more)

### Community 28 - "StoreContext"
Cohesion: 0.35
Nodes (6): ref_lucide_react, FinanceStats(), NoData(), ServerError(), TableLoading(), StoreContext

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
Cohesion: 0.16
Nodes (14): applyCreditMemoForCollection(), applyOrderPaymentEffects(), checkCreateSalesJornal(), checkReadAllSales(), checkReadCashierAll(), checkReadCashierLimit(), checkReadLastSalesJournal(), checkUpdateSales() (+6 more)

### Community 53 - "vite.config.js"
Cohesion: 0.29
Nodes (5): ref_file, ref_path, ref_tailwindcss_vite, ref_vite, ref_vitejs_plugin_react

### Community 66 - "ref_react"
Cohesion: 0.12
Nodes (3): ref_react, LoadImages(), TableSpinner()

### Community 67 - "google-api-personal.php"
Cohesion: 0.19
Nodes (14): Google\Service\Drive, checkDeleteGoogleDriveApiFiles(), checkFileInput(), checkFolderIfExistOrCreate(), checkToUploadGoogleDrive(), createFolder(), deleteGoogleFileByFileId(), fileUploadToGoogleDriveWithPublicPermission() (+6 more)

### Community 68 - "ProtectedRouteUser.jsx"
Cohesion: 0.15
Nodes (14): ref_react_dom, ref_react_router_dom, App(), UrlAdmin, UrlDeveloper, src_index, PageNotFound(), routesCashier (+6 more)

### Community 71 - "ViewProducts.jsx"
Cohesion: 0.17
Nodes (12): CloseButton(), ExportModal(), ExportProgressWidget(), ViewSalesDetails(), ViewProducts(), ExportContext, ExportProvider(), initState (+4 more)

### Community 72 - "google-api-dwd.php"
Cohesion: 0.23
Nodes (12): checkDeleteGoogleDriveApiFiles(), checkFileInput(), checkToUploadGoogleDrive(), deleteGoogleFileByFileId(), fileUploadToGoogleDriveWithPublicPermission(), getClientService(), getDirectoryPath(), getDriveFile() (+4 more)

### Community 73 - "StoreContext.jsx"
Cohesion: 0.14
Nodes (7): InputCheckbox(), InputPhotoUpload(), InputRadioButton(), Toast(), initVal, StoreProvider(), StoreReducer()

### Community 75 - "SpacesStorage"
Cohesion: 0.18
Nodes (3): Aws\Exception\AwsException, Aws\S3\S3Client, SpacesStorage

### Community 119 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): ref_eslint_js, ref_eslint_plugin_react, ref_eslint_plugin_react_hooks, ref_eslint_plugin_react_refresh, ref_globals

### Community 175 - "Header.jsx"
Cohesion: 0.27
Nodes (7): ScreenSpinner(), quickHeaderShortCut(), Header(), checkLocalStorage(), clearSession(), performLogout(), NOTE: this only clears the current tab's in-memory/local state. Other

### Community 291 - "returnError"
Cohesion: 0.22
Nodes (3): Database, checkDbConnection(), returnError()

### Community 294 - "suppliers/functions.php"
Cohesion: 0.13
Nodes (14): checkAssociatedInPurchaseOrderById(), checkCreateProduct(), checkCreateSupplierDescription(), checkDeleteSupplierProduct(), checkReadBySupplierDescriptionName(), checkReadGoupBySupplierAddress(), checkReadGoupBySupplierDescriptionName(), checkReadGoupBySupplierEmail() (+6 more)

### Community 295 - "isEmptyItem"
Cohesion: 0.08
Nodes (94): ref_exceljs, ref_formik, ref_get_blob_duration, ref_tanstack_react_query, ref_yup, LogoFull(), ExportCSVButton(), ModalButton() (+86 more)

### Community 299 - "customer/functions.php"
Cohesion: 0.18
Nodes (8): checkReadAllActive(), checkReadAllContact(), checkReadAllCustomers(), checkReadAllEmail(), checkReadAllOpenBalance(), checkReadAllOverdueBalance(), checkReadWalkInCustomer(), isUserAccountAssociated()

### Community 309 - "formatDate.jsx"
Cohesion: 0.60
Nodes (4): setTimeZone, formatDate(), formatDateRange(), options()

## Knowledge Gaps
- **27 isolated node(s):** `{ defineConfig }`, `salesData`, `dashboardData`, `profitLossData`, `urlPath` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 518 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **278 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `logError()` connect `logError` to `core/functions.php`, `ReportSalesOrder`, `Products`, `ProductOwner`, `User`, `Suppliers`, `Customer`, `Role`, `SuppliersProduct`, `SuppliersPurchaseOrder`, `AccountReceivable`, `StockMovement`, `ActivityLog`, `Overview`, `StockOverview`, `returnError`, `SuppliersPurchaseMovement`, `AccountPayable`, `CashSales`, `Expenses`, `FinanceReturns`, `SalesJournal`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Why does `checkQuery()` connect `checkQuery` to `user/functions.php`, `activity-log/functions.php`, `product/functions.php`, `suppliers/functions.php`, `developer/returns/functions.php`, `core/functions.php`, `getResultData`, `customer/functions.php`, `sales-order/functions.php`, `role/functions.php`, `purchase-order/functions.php`, `purchase-order-movement/functions.php`, `account-payable/functions.php`, `finance/returns/functions.php`, `product-owner/functions.php`, `products/functions.php`, `cash-sales/functions.php`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `returnError()` connect `returnError` to `google-api-personal.php`, `google-api.php`, `core/functions.php`, `SuppliersPurchaseMovement`, `google-api-dwd.php`, `logError`, `SpacesStorage`, `purchase-order/functions.php`, `AccountReceivable`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Are the 332 inferred relationships involving `logError()` (e.g. with `.create()` and `.createSupplierDescription()`) actually correct?**
  _`logError()` has 332 INFERRED edges - model-reasoned connections that need verification._
- **Are the 158 inferred relationships involving `checkQuery()` (e.g. with `checkCreateOtherSupplier()` and `checkCreateWalkInCustomer()`) actually correct?**
  _`checkQuery()` has 158 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ defineConfig }`, `salesData`, `dashboardData` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InfiniteTable.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10667996011964108 - nodes in this community are weakly interconnected._