# ALICE-NTUST-webapps
## 1. 作業說明
此repo並不能直接執行，此repo作為dev和product版本控制同步使用，dev版本為開發版本，product版本為正式版本。

## Trouble Shooting
### 中文編碼問題
請加上
```jsp
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
```
1. 一定要在當頁加上去，includle的方法不行
2. 用篩選課程測試也是有用的