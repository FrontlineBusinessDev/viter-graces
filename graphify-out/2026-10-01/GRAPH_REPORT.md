# Graph Report - viter-graces  (2026-09-29)

## Corpus Check
- 537 files · ~513,035 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1866 nodes · 5539 edges · 307 communities (268 shown, 39 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 549 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `531a3c74`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- StoreContext.jsx
- stock-movement/functions.php
- CreatePassword.jsx
- MobileResponsiveList.jsx
- returnError
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
- suppliers/functions.php
- isEmptyItem
- customer/functions.php

## God Nodes (most connected - your core abstractions)
1. `logError()` - 333 edges
2. `checkQuery()` - 187 edges
3. `isEmptyItem()` - 133 edges
4. `PHPMailer` - 116 edges
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

## Communities (307 total, 39 thin omitted)

### Community 0 - "StoreContext.jsx"
Cohesion: 0.08
Nodes (85): App(), AmountRangeFilter(), DateRangeFilter(), dateRangeLabel(), MultiRangeAmountFilter(), MultiRangeDateFilter(), nextRangeId(), rangeLabel() (+77 more)

### Community 1 - "stock-movement/functions.php"
Cohesion: 0.40
Nodes (3): checkReadAllLocation(), checkReadAllNotes(), isUserAccountAssociated()

### Community 2 - "CreatePassword.jsx"
Cohesion: 0.11
Nodes (29): LogoFull(), LogoFullSm(), InputLogin(), SearchBar(), ButtonSpinner(), FetchingSpinner(), devNavUrl, checkRoleToRedirect() (+21 more)

### Community 3 - "MobileResponsiveList.jsx"
Cohesion: 0.05
Nodes (73): ActionButton(), CloseButton(), DateFormat(), ExportModal(), AmountsWithPesoSign(), AmountWithPesoSign(), Pills(), ExportProgressWidget() (+65 more)

### Community 4 - "returnError"
Cohesion: 0.06
Nodes (46): Aws\Exception\AwsException, Aws\S3\S3Client, Google\Client, Google\Service\Drive, Database, checkDbConnection(), returnError(), checkDeleteGoogleDriveApiFiles() (+38 more)

### Community 5 - "core/functions.php"
Cohesion: 0.04
Nodes (49): Firebase\JWT\JWT, isItemAssociatedWithReturn(), isOrderAssociatedWithReturn(), isQtyChangeAssociatedWithReturn(), isUserAccountAssociated(), checkActive(), checkApprove(), checkAssociatedById() (+41 more)

### Community 6 - "SMTP"
Cohesion: 0.07
Nodes (8): Exception, SMTP, sendEmail(), getHtmlResetPassword(), getHtmlVerifyAccount(), getHtmlVerifyEmail(), sendEmail(), sendEmailVerify()

### Community 8 - "ActivityLogDetailsModal.jsx"
Cohesion: 0.10
Nodes (44): ActivityLogDetailsModal(), ArrayOfObjectsCards(), BOOLEAN_LIKE_VALUES, BooleanPill(), buildReturnSummary(), canonicalizeKey(), cleanEntries(), DetailValue() (+36 more)

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

### Community 23 - "config.jsx"
Cohesion: 0.06
Nodes (61): AddButton(), dashboardData, DashboardOverview(), salesData, FinanceStats(), GraphTooltip(), InputPurchaseOrderSelectTagArray(), InputSelectCustomerArray() (+53 more)

### Community 25 - "product-owner/functions.php"
Cohesion: 0.17
Nodes (13): checkReadByCreatedBy(), checkReadByProductOwner(), checkReadByProductOwnerLimit(), checkReadByReceivedBy(), checkUpdateActivityLog(), checkUpdateProducts(), checkUpdatePurchaseOrder(), checkUpdateReturnProduct() (+5 more)

### Community 27 - "products/functions.php"
Cohesion: 0.09
Nodes (15): checkReadAllLowStock(), checkReadByUserIdLowStock(), checkReadCountLowStock(), isUserAccountAssociated(), checkCreateMovementStock(), checkDeleteMovementStock(), checkReadAllActive(), checkReadAllActiveByName() (+7 more)

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

### Community 294 - "suppliers/functions.php"
Cohesion: 0.13
Nodes (14): checkAssociatedInPurchaseOrderById(), checkCreateProduct(), checkCreateSupplierDescription(), checkDeleteSupplierProduct(), checkReadBySupplierDescriptionName(), checkReadGoupBySupplierAddress(), checkReadGoupBySupplierDescriptionName(), checkReadGoupBySupplierEmail() (+6 more)

### Community 295 - "isEmptyItem"
Cohesion: 0.09
Nodes (81): ExportCSVButton(), ModalButton(), InputCheckbox(), InputPhotoUpload(), InputRadioButton(), DefaultInputSelectTagArray(), InputSalesOrderSelectTagArray(), InputSelect() (+73 more)

### Community 299 - "customer/functions.php"
Cohesion: 0.18
Nodes (8): checkReadAllActive(), checkReadAllContact(), checkReadAllCustomers(), checkReadAllEmail(), checkReadAllOpenBalance(), checkReadAllOverdueBalance(), checkReadWalkInCustomer(), isUserAccountAssociated()

## Knowledge Gaps
- **27 isolated node(s):** `{ defineConfig }`, `salesData`, `dashboardData`, `profitLossData`, `urlPath` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `logError()` connect `logError` to `returnError`, `core/functions.php`, `ReportSalesOrder`, `Products`, `ProductOwner`, `User`, `Suppliers`, `Customer`, `Role`, `SuppliersProduct`, `SuppliersPurchaseOrder`, `AccountReceivable`, `StockMovement`, `ActivityLog`, `Overview`, `StockOverview`, `SuppliersPurchaseMovement`, `AccountPayable`, `CashSales`, `Expenses`, `FinanceReturns`, `SalesJournal`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `checkQuery()` connect `checkQuery` to `stock-movement/functions.php`, `user/functions.php`, `activity-log/functions.php`, `product/functions.php`, `suppliers/functions.php`, `developer/returns/functions.php`, `core/functions.php`, `getResultData`, `customer/functions.php`, `sales-order/functions.php`, `role/functions.php`, `purchase-order/functions.php`, `purchase-order-movement/functions.php`, `account-payable/functions.php`, `finance/returns/functions.php`, `product-owner/functions.php`, `products/functions.php`, `cash-sales/functions.php`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `returnError()` connect `returnError` to `SuppliersPurchaseMovement`, `core/functions.php`, `logError`, `purchase-order/functions.php`, `AccountReceivable`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Are the 332 inferred relationships involving `logError()` (e.g. with `.create()` and `.createSupplierDescription()`) actually correct?**
  _`logError()` has 332 INFERRED edges - model-reasoned connections that need verification._
- **Are the 158 inferred relationships involving `checkQuery()` (e.g. with `checkCreateOtherSupplier()` and `checkCreateWalkInCustomer()`) actually correct?**
  _`checkQuery()` has 158 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ defineConfig }`, `salesData`, `dashboardData` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `StoreContext.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08351440717997166 - nodes in this community are weakly interconnected._