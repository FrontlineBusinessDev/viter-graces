# Graph Report - viter-graces  (2026-09-18)

## Corpus Check
- 534 files · ~504,265 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1839 nodes · 5436 edges · 306 communities (268 shown, 38 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 528 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c4816361`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- InfiniteTable.jsx
- isEmptyItem
- CreatePassword.jsx
- MobileResponsiveList.jsx
- returnError
- core/functions.php
- SMTP
- PHPMailer
- ActivityLogDetailsModal.jsx
- logError
- checkQuery
- stock-overview/functions.php
- sales-order/functions.php
- ReportSalesOrder
- checkExistence
- Products
- ProductOwner
- User
- Suppliers
- Customer
- Role
- config.jsx
- SuppliersProduct
- product-owner/functions.php
- SuppliersPurchaseOrder
- products/functions.php
- AccountReceivable
- StockMovement
- ActivityLog
- Overview
- StockOverview
- user/functions.php
- SuppliersPurchaseMovement
- activity-log/functions.php
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
- CLAUDE.md
- cypress.config.cjs
- accounts-payable-filters.cy.js
- expenses-filters.cy.js
- movement-history.cy.js
- expenses-report.cy.js
- sales-reports.cy.js
- Dotenv\Dotenv
- cash-sales/functions.php
- movement-history-filters.cy.js
- returns-filters.cy.js
- sales-orders-filters.cy.js
- stocks-overview-filters.cy.js
- InfiniteFilterWithDropDown.jsx
- suppliers/functions.php
- purchase-order/functions.php
- customer/functions.php

## God Nodes (most connected - your core abstractions)
1. `logError()` - 321 edges
2. `checkQuery()` - 179 edges
3. `isEmptyItem()` - 133 edges
4. `PHPMailer` - 116 edges
5. `StoreContext` - 109 edges
6. `setError()` - 66 edges
7. `setMessage()` - 63 edges
8. `useQueryData()` - 62 edges
9. `ProductOwnerId()` - 60 edges
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

## Communities (306 total, 38 thin omitted)

### Community 0 - "InfiniteTable.jsx"
Cohesion: 0.11
Nodes (69): AmountRangeFilter(), DateRangeFilter(), dateRangeLabel(), MultiRangeAmountFilter(), MultiRangeDateFilter(), nextRangeId(), rangeLabel(), useFilterPopover() (+61 more)

### Community 1 - "isEmptyItem"
Cohesion: 0.09
Nodes (82): ExportCSVButton(), ModalButton(), InputCheckbox(), InputPhotoUpload(), InputRadioButton(), DefaultInputSelectTagArray(), InputSalesOrderSelectTagArray(), InputSelectArray() (+74 more)

### Community 2 - "CreatePassword.jsx"
Cohesion: 0.08
Nodes (39): LogoFull(), LogoFullSm(), InputLogin(), ButtonSpinner(), FetchingSpinner(), ScreenSpinner(), devNavUrl, isDemoMode (+31 more)

### Community 3 - "MobileResponsiveList.jsx"
Cohesion: 0.08
Nodes (49): ActionButton(), AmountsWithPesoSign(), AmountWithPesoSign(), PesoSign(), Pills(), ActionButtonMobile(), ActionButtonSubTable(), variantsStatus() (+41 more)

### Community 4 - "returnError"
Cohesion: 0.06
Nodes (46): Aws\Exception\AwsException, Aws\S3\S3Client, Google\Client, Google\Service\Drive, Database, checkDbConnection(), returnError(), checkDeleteGoogleDriveApiFiles() (+38 more)

### Community 5 - "core/functions.php"
Cohesion: 0.04
Nodes (41): Firebase\JWT\JWT, checkActive(), checkApprove(), checkDecline(), checkDelete(), checkFilterByStatus(), checkFilterByStatusAndSearch(), checkFilterDate() (+33 more)

### Community 6 - "SMTP"
Cohesion: 0.07
Nodes (8): Exception, SMTP, sendEmail(), getHtmlResetPassword(), getHtmlVerifyAccount(), getHtmlVerifyEmail(), sendEmail(), sendEmailVerify()

### Community 8 - "ActivityLogDetailsModal.jsx"
Cohesion: 0.10
Nodes (44): ActivityLogDetailsModal(), ArrayOfObjectsCards(), BOOLEAN_LIKE_VALUES, BooleanPill(), buildReturnSummary(), canonicalizeKey(), cleanEntries(), DetailValue() (+36 more)

### Community 9 - "logError"
Cohesion: 0.06
Nodes (3): logError(), Returns, SalesOrder

### Community 10 - "checkQuery"
Cohesion: 0.09
Nodes (39): checkReadExpensesPerMonth(), checkReadExpensesPerWeek(), checkReadExpensesPerYear(), checkReadSalesPerMonth(), checkReadSalesPerWeek(), checkReadSalesPerYear(), checkReadAllAP(), checkReadAllAR() (+31 more)

### Community 11 - "stock-overview/functions.php"
Cohesion: 0.33
Nodes (4): checkReadAllLowStock(), checkReadByUserIdLowStock(), checkReadCountLowStock(), isUserAccountAssociated()

### Community 12 - "sales-order/functions.php"
Cohesion: 0.07
Nodes (31): checkCreateInstallment(), checkCreateMovementStock(), checkCreateSalesJornal(), checkCreateSalesJournalRemoved(), checkDeleteById(), checkDeleteInstallment(), checkDeleteinstallmentById(), checkDeleteSalesJournal() (+23 more)

### Community 14 - "checkExistence"
Cohesion: 0.09
Nodes (18): checkReadAllLocation(), checkReadAllNotes(), isUserAccountAssociated(), isItemAssociatedWithReturn(), isOrderAssociatedWithReturn(), isQtyChangeAssociatedWithReturn(), isUserAccountAssociated(), checkUpdateUserAccountRole() (+10 more)

### Community 23 - "config.jsx"
Cohesion: 0.07
Nodes (54): dashboardData, DashboardOverview(), salesData, FinanceStats(), GraphTooltip(), InputPurchaseOrderSelectTagArray(), InputSelectCustomerArray(), InputSelectTagArray() (+46 more)

### Community 25 - "product-owner/functions.php"
Cohesion: 0.19
Nodes (12): checkReadByProductOwner(), checkReadByProductOwnerLimit(), checkReadByReceivedBy(), checkUpdateActivityLog(), checkUpdateProducts(), checkUpdatePurchaseOrder(), checkUpdateReturnProduct(), checkUpdateSalesOrder() (+4 more)

### Community 27 - "products/functions.php"
Cohesion: 0.14
Nodes (11): checkCreateMovementStock(), checkDeleteMovementStock(), checkReadAllActive(), checkReadAllActiveByName(), checkReadAllCategory(), checkReadAllSku(), checkReadAllThatHaveStock(), checkReadAllUnit() (+3 more)

### Community 34 - "user/functions.php"
Cohesion: 0.19
Nodes (12): checkAssociatedByActivityLog(), checkAssociatedByMenu(), checkAssociatedByProducts(), checkReadGoupByEmail(), checkReadGoupByName(), checkReadGoupByProductOwner(), checkReadGoupByProductOwnerEmail(), checkReadGoupByRole() (+4 more)

### Community 36 - "activity-log/functions.php"
Cohesion: 0.17
Nodes (11): checkCreateOtherSupplier(), checkCreateWalkInCustomer(), checkReadAllActivityLogAction(), checkReadAllActivityLogMenu(), checkReadAllActivityLogRole(), checkReadAllActivityLogUser(), checkReadByLimit(), checkSupplierDescription() (+3 more)

### Community 39 - "developer/returns/functions.php"
Cohesion: 0.18
Nodes (8): checkCreateMovementStock(), checkDeleteReturnMovement(), checkReadAllActiveByName(), checkReadAllReturnedOrderNumbers(), checkReadAllReturnedProductNumbers(), checkReadAllReturnedProductReasons(), checkReadAllThatHaveStock(), isUserAccountAssociated()

### Community 42 - "getResultData"
Cohesion: 0.21
Nodes (12): applyCreditMemoForCollection(), applyOrderPaymentEffects(), checkCreateSalesJornal(), checkReadAllSales(), checkReadLastSalesJournal(), checkUpdateSales(), checkReturnIsEditable(), applyCreditMemoToReturns() (+4 more)

### Community 175 - "InfiniteFilterWithDropDown.jsx"
Cohesion: 0.09
Nodes (32): App(), AddButton(), CloseButton(), DateFormat(), DebouncedInput(), ExportModal(), SearchBar(), ExportProgressWidget() (+24 more)

### Community 294 - "suppliers/functions.php"
Cohesion: 0.13
Nodes (14): checkAssociatedInPurchaseOrderById(), checkCreateProduct(), checkCreateSupplierDescription(), checkDeleteSupplierProduct(), checkReadBySupplierDescriptionName(), checkReadGoupBySupplierAddress(), checkReadGoupBySupplierDescriptionName(), checkReadGoupBySupplierEmail() (+6 more)

### Community 295 - "purchase-order/functions.php"
Cohesion: 0.25
Nodes (5): checkDeleteById(), checkItemsBelongToSupplier(), checkReadExpensesToday(), checkReadGoupByPurchaseOrderNumber(), isUserAccountAssociated()

### Community 299 - "customer/functions.php"
Cohesion: 0.18
Nodes (8): checkReadAllActive(), checkReadAllContact(), checkReadAllCustomers(), checkReadAllEmail(), checkReadAllOpenBalance(), checkReadAllOverdueBalance(), checkReadWalkInCustomer(), isUserAccountAssociated()

## Knowledge Gaps
- **26 isolated node(s):** `{ defineConfig }`, `salesData`, `dashboardData`, `profitLossData`, `urlPath` (+21 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **38 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `logError()` connect `logError` to `returnError`, `core/functions.php`, `ReportSalesOrder`, `Products`, `ProductOwner`, `User`, `Suppliers`, `Customer`, `Role`, `SuppliersProduct`, `SuppliersPurchaseOrder`, `AccountReceivable`, `StockMovement`, `ActivityLog`, `Overview`, `StockOverview`, `SuppliersPurchaseMovement`, `AccountPayable`, `CashSales`, `Expenses`, `FinanceReturns`, `SalesJournal`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `checkQuery()` connect `checkQuery` to `user/functions.php`, `activity-log/functions.php`, `core/functions.php`, `suppliers/functions.php`, `developer/returns/functions.php`, `purchase-order/functions.php`, `getResultData`, `customer/functions.php`, `stock-overview/functions.php`, `sales-order/functions.php`, `checkExistence`, `purchase-order-movement/functions.php`, `account-payable/functions.php`, `product-owner/functions.php`, `products/functions.php`, `cash-sales/functions.php`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `returnError()` connect `returnError` to `SuppliersPurchaseMovement`, `core/functions.php`, `purchase-order/functions.php`, `logError`, `AccountReceivable`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Are the 320 inferred relationships involving `logError()` (e.g. with `.create()` and `.createSupplierDescription()`) actually correct?**
  _`logError()` has 320 INFERRED edges - model-reasoned connections that need verification._
- **Are the 150 inferred relationships involving `checkQuery()` (e.g. with `checkCreateOtherSupplier()` and `checkCreateWalkInCustomer()`) actually correct?**
  _`checkQuery()` has 150 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ defineConfig }`, `salesData`, `dashboardData` to the rest of the system?**
  _26 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `InfiniteTable.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11100760751436112 - nodes in this community are weakly interconnected._