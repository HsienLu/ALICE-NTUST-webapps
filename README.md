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

### babel的使用方法
```bash
npx babel "被轉化的檔案路徑" --out-file "轉化後的檔案路徑" 
```
需要將輸出的檔案保留原本路徑結構，可以使用 --copy-files 和路徑模擬工具(待測試)
```bash
npx babel src --watch --out-dir . --copy-files
```