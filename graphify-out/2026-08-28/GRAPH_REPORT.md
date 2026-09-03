# Graph Report - .  (2026-08-20)

## Corpus Check
- 435 files · ~340,904 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1271 nodes · 1616 edges · 321 communities (282 shown, 39 thin omitted)
- Extraction: 75% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 398 edges (avg confidence: 0.8)
- Token cost: 59,610 input · 0 output

## Community Hubs (Navigation)
- Action Button Components
- Access/Permission Checks (functions.php)
- Database Connection & Google API Config
- Sales Order Model
- Expense/Sales Read-Permission Checks
- Installment & Stock Movement Checks
- Sales Order Reporting
- Low-Stock & Column-Access Checks
- App Shell & Routing (React)
- User Model
- Products Model
- Product Owner Model
- Suppliers Model
- Customer
- Role
- AP/AR/Expenses Report Pages
- Returns
- Supplierspurchaseorder
- Modalsalesorders & related
- Suppliersproduct
- Functions & related
- Pesosign & related
- Functions
- Stockmovement
- Dashboardcharts & related
- Activitylog
- Overview
- Stockoverview
- App & related
- Functions
- Function Header & related
- Functions
- Functions
- Querydata & related
- Isemptyitem & related
- Functions
- Response
- Accountpayable
- Functions
- Functions
- Functions
- Modalbutton & related
- Accountspayable & related
- Accountsreceivable & related
- Modalstockoverview & related
- Functions & related
- Modalproductowner & related
- Modaladditem & related
- Functions
- Cashsales
- Expenses
- Salesjournal
- Encryption
- Loadimages & related
- Useuploadmultiplefiles
- Useuploadmultiplefilesold
- Function Nav & related
- Expenses & related
- Modalproducts & related
- Modalroles & related
- Modaluser & related
- Formatdate
- Functions
- Functions
- Movement History.Cy

## God Nodes (most connected - your core abstractions)
1. `logError()` - 257 edges
2. `checkQuery()` - 136 edges
3. `SalesOrder` - 39 edges
4. `ReportSalesOrder` - 33 edges
5. `Products` - 23 edges
6. `User` - 23 edges
7. `ProductOwner` - 20 edges
8. `ActionButtonMobile()` - 20 edges
9. `Suppliers` - 18 edges
10. `checkExistence()` - 17 edges

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

## Communities (321 total, 39 thin omitted)

### Community 0 - "Action Button Components"
Cohesion: 0.06
Nodes (39): ActionButtonMobile(), ActionButtonSubTable(), ActionButtonTable(), ActionTableList(), ActiveInActiveStatus(), ActivityLogDetails(), OverviewSalesCustomer(), APReportMobileResponsive() (+31 more)

### Community 1 - "Access/Permission Checks (functions.php)"
Cohesion: 0.04
Nodes (43): checkActive(), checkApprove(), checkAssociatedById(), checkAssociatedByName(), checkDecline(), checkDelete(), checkFilterByStatus(), checkFilterByStatusAndSearch() (+35 more)

### Community 2 - "Database Connection & Google API Config"
Cohesion: 0.05
Nodes (20): Database, checkDbConnection(), returnError(), checkDeleteGoogleDriveApiFiles(), checkFileInput(), checkFolderIfExistOrCreate(), checkToUploadGoogleDrive(), createFolder() (+12 more)

### Community 4 - "Expense/Sales Read-Permission Checks"
Cohesion: 0.09
Nodes (36): checkReadExpensesPerMonth(), checkReadExpensesPerWeek(), checkReadExpensesPerYear(), checkReadSalesPerMonth(), checkReadSalesPerWeek(), checkReadSalesPerYear(), checkReadAllAP(), checkReadAllAR() (+28 more)

### Community 5 - "Installment & Stock Movement Checks"
Cohesion: 0.08
Nodes (30): checkCreateInstallment(), checkCreateMovementStock(), checkCreateSalesJornal(), checkCreateSalesJournalRemoved(), checkDeleteById(), checkDeleteInstallment(), checkDeleteinstallmentById(), checkDeleteSalesJournal() (+22 more)

### Community 7 - "Low-Stock & Column-Access Checks"
Cohesion: 0.08
Nodes (18): isUserAccountAssociated(), checkReadAllLowStock(), checkReadByUserIdLowStock(), checkReadCountLowStock(), isUserAccountAssociated(), checkCreateMovementStock(), checkDeleteMovementStock(), checkReadAllActiveByName() (+10 more)

### Community 8 - "App Shell & Routing (React)"
Cohesion: 0.12
Nodes (13): App(), PageNotFound(), routesCashier, routesAccess, routesAdmin, routesDeveloper, routesProductOwner, initVal (+5 more)

### Community 20 - "Modalsalesorders & related"
Cohesion: 0.27
Nodes (6): ModalCustomer(), ModalSalesOrders(), PropsValues(), Validations(), ModalSalesOrders(), ViewSalesDetails()

### Community 22 - "Functions & related"
Cohesion: 0.22
Nodes (5): PropsValues(), ValidationsStockMovement(), ModalPurchaseOrder(), ModalPurchaseOrderMovement(), ViewAccountsPayableDetails()

### Community 24 - "Functions"
Cohesion: 0.23
Nodes (9): checkReadByProductOwner(), checkReadByProductOwnerLimit(), checkReadByReceivedBy(), checkUpdateActivityLog(), checkUpdateProducts(), checkUpdatePurchaseOrder(), checkUpdateSalesOrder(), checkUpdateSuppliersProduct() (+1 more)

### Community 26 - "Dashboardcharts & related"
Cohesion: 0.24
Nodes (4): dashboardData, salesData, GraphTooltip(), profitLossData

### Community 30 - "App & related"
Cohesion: 0.25
Nodes (7): Dockerfile, inventory-app (deployed service name), web service definition, Graces Portal (app title), main.jsx module entry script, inline theme (dark/light) init script, viter-graces (README)

### Community 31 - "Functions"
Cohesion: 0.33
Nodes (7): checkAssociatedByActivityLog(), checkAssociatedByMenu(), checkAssociatedByProducts(), checkResetPasswordByEmail(), checkUpdateActivityLog(), checkUpdateProducts(), updateConnectedMenu()

### Community 32 - "Function Header & related"
Cohesion: 0.36
Nodes (4): quickHeaderShortCut(), titleHeaderTab(), Header(), TitleHeader()

### Community 33 - "Functions"
Cohesion: 0.29
Nodes (6): checkCreateOtherSupplier(), checkCreateWalkInCustomer(), checkReadByLimit(), createActivityLog(), createActivityLogWithPhp(), checkCreate()

### Community 34 - "Functions"
Cohesion: 0.25
Nodes (5): checkReadAllActive(), checkReadAllOpenBalance(), checkReadAllOverdueBalance(), checkReadWalkInCustomer(), isUserAccountAssociated()

### Community 35 - "Querydata & related"
Cohesion: 0.46
Nodes (4): queryData(), queryDataInfinite(), useQueryData(), userAccountLogin()

### Community 36 - "Isemptyitem & related"
Cohesion: 0.36
Nodes (3): isEmptyItem(), ProductOwnerId(), ProductOwnerName()

### Community 37 - "Functions"
Cohesion: 0.29
Nodes (4): checkCreateMovementStock(), checkReadAllActiveByName(), checkReadAllThatHaveStock(), isUserAccountAssociated()

### Community 41 - "Functions"
Cohesion: 0.40
Nodes (4): checkCreateSalesJornal(), checkReadAllSales(), checkReadLastSalesJournal(), checkUpdateSales()

### Community 42 - "Functions"
Cohesion: 0.40
Nodes (4): checkCreateProduct(), checkUpdateProductSupplier(), isUserAccountAssociated(), updateConnectedMenu()

### Community 43 - "Functions"
Cohesion: 0.33
Nodes (3): checkDeleteById(), checkReadExpensesToday(), isUserAccountAssociated()

### Community 51 - "Functions"
Cohesion: 0.50
Nodes (3): checkUpdateUserAccountRole(), isUserAccountAssociated(), updateConnectedMenu()

### Community 57 - "Useuploadmultiplefiles"
Cohesion: 0.83
Nodes (3): handleGetSeconds(), handleMergeTwoArrayFiles(), useUploadMultipleFiles()

### Community 58 - "Useuploadmultiplefilesold"
Cohesion: 0.83
Nodes (3): handleGetSeconds(), handleMergeTwoArrayFiles(), useUploadMultipleFiles()

### Community 64 - "Formatdate"
Cohesion: 0.83
Nodes (3): formatDate(), formatDateRange(), options()

## Knowledge Gaps
- **9 isolated node(s):** `salesData`, `dashboardData`, `profitLossData`, `initVal`, `StoreContext` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `logError()` connect `Sales Order Model` to `Access/Permission Checks (functions.php)`, `Database Connection & Google API Config`, `Sales Order Reporting`, `User Model`, `Products Model`, `Product Owner Model`, `Suppliers Model`, `Customer`, `Role`, `Returns`, `Supplierspurchaseorder`, `Suppliersproduct`, `Stockmovement`, `Activitylog`, `Overview`, `Stockoverview`, `Accountpayable`, `Cashsales`, `Expenses`, `Salesjournal`?**
  _High betweenness centrality (0.196) - this node is a cross-community bridge._
- **Why does `checkQuery()` connect `Expense/Sales Read-Permission Checks` to `Functions`, `Functions`, `Functions`, `Functions`, `Functions`, `Installment & Stock Movement Checks`, `Low-Stock & Column-Access Checks`, `Access/Permission Checks (functions.php)`, `Functions`, `Functions`, `Functions`, `Functions`, `Functions`, `Functions`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `returnError()` connect `Database Connection & Google API Config` to `Access/Permission Checks (functions.php)`, `Sales Order Model`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Are the 256 inferred relationships involving `logError()` (e.g. with `.create()` and `.delete()`) actually correct?**
  _`logError()` has 256 INFERRED edges - model-reasoned connections that need verification._
- **Are the 105 inferred relationships involving `checkQuery()` (e.g. with `checkCreateOtherSupplier()` and `checkCreateWalkInCustomer()`) actually correct?**
  _`checkQuery()` has 105 INFERRED edges - model-reasoned connections that need verification._
- **What connects `IMPORTANT: ensure intercept is active before click`, `salesData`, `dashboardData` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Action Button Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05660945498343872 - nodes in this community are weakly interconnected._