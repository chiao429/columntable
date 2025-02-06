import React, { useState } from "react";
import { Alert } from "./components/ui/alert";
import { InfoIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";

const ColumnTable = () => {
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const parseXML = async (file) => {
    try {
      const text = await file.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");

      const parseError = xmlDoc.querySelector("parsererror");
      if (parseError) {
        throw new Error("XML 解析錯誤");
      }

      const fields = Array.from(xmlDoc.querySelectorAll("row > field")).map((field) => ({
        header: field.getAttribute("name"),
        value: field.textContent || "",
        isReference: field.getAttribute("name") === "reference"
      }));

      const groupedData = [];
      for (let i = 0; i < fields.length; i += 8) {
        groupedData.push({
          fields: fields.slice(i, i + 8),
          hasReference: fields.slice(i, i + 8).some((f) => f.isReference)
        });
      }

      setData(groupedData);
      setError("");
    } catch (err) {
      setError("處理 XML 時發生錯誤: " + err.message);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".xml")) {
      setError("請上傳 XML 檔案");
      return;
    }

    parseXML(file);
  };

  const handleCopy = () => {
    if (data.length === 0) {
      setError("請先上傳 XML 檔案");
      return;
    }

    const tempDiv = document.createElement("div");

    data.forEach((group, groupIndex) => {
      const regularFields = group.fields.filter((f) => !f.isReference);
      const referenceField = group.fields.find((f) => f.isReference);

      if (regularFields.length > 0) {
        let tableHtml =
          '<table style="border-collapse: collapse; width: 100%; margin-bottom: 4px;">';
        tableHtml += "<tr>";
        regularFields.forEach((field) => {
          tableHtml += `<td style="border: 1px solid #ccc; padding: 2px 4px; background-color: #e5e7eb; font-size: 10pt; white-space: nowrap;">${field.header}</td>`;
        });
        tableHtml += "</tr>";

        tableHtml += "<tr>";
        regularFields.forEach((field) => {
          tableHtml += `<td style="border: 1px solid #ccc; padding: 2px 4px; font-size: 10pt; white-space: nowrap;">${field.value}</td>`;
        });
        tableHtml += "</tr></table>";
        tempDiv.innerHTML += tableHtml;
      }

      if (referenceField) {
        let refTableHtml =
          '<table style="border-collapse: collapse; width: 100%; margin-bottom: 4px;">';
        refTableHtml +=
          '<tr><td style="border: 1px solid #ccc; padding: 2px 4px; background-color: #e5e7eb; font-size: 10pt;">' +
          referenceField.header +
          "</td></tr>";
        refTableHtml +=
          '<tr><td style="border: 1px solid #ccc; padding: 2px 4px; font-size: 10pt;">' +
          referenceField.value +
          "</td></tr></table>";
        tempDiv.innerHTML += refTableHtml;
      }

      if (groupIndex < data.length - 1) {
        tempDiv.innerHTML += "<br>";
      }
    });

    document.body.appendChild(tempDiv);

    const range = document.createRange();
    range.selectNode(tempDiv);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand("copy");
      setShowCopyAlert(true);
      setTimeout(() => setShowCopyAlert(false), 3000);
    } catch (err) {
      setError("複製失敗: " + err.message);
    }

    selection.removeAllRanges();
    document.body.removeChild(tempDiv);
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          accept=".xml"
          onChange={handleFileUpload}
          className="block w-full max-w-sm text-sm text-gray-500 mx-auto
           file:mr-4 file:py-2 file:px-4
           file:rounded file:border-0
           file:text-sm file:font-semibold
           file:bg-blue-50 file:text-blue-700
           hover:file:bg-blue-100"
        />
        <div className="flex items-center gap-2">
          <div className="text-red-500">注意！目前只支援XML內一筆資料轉換</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDialogOpen(true)}>
            <InfoIcon className="h-4 w-4" />
          </Button>
          {isDialogOpen && (
            <Dialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}>
              <DialogContent onClose={() => setIsDialogOpen(false)}>
                <DialogHeader>
                  <DialogTitle>使用說明</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <p>1. 選擇要轉換的 XML 檔案</p>
                  <p>2. 確認預覽資料正確</p>
                  <p>3. 點擊「複製表格」按鈕</p>
                  <p>4. 直接貼到 Google Doc 即可</p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <button
          onClick={() => {
            setData([]);
            setError("");
            setShowCopyAlert(false);
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
              fileInput.value = "";
              fileInput.dispatchEvent(new Event("change"));
            }
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          disabled={data.length === 0}>
          清除
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={data.length === 0}>
          複製表格 (可貼到 Google Doc)
        </button>
        {showCopyAlert && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            表格已複製到剪貼板！
          </Alert>
        )}
      </div>

      {error && <Alert className="bg-red-50 text-red-800 border-red-200">{error}</Alert>}

      <div className="w-full space-y-1">
        {data.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="space-y-1">
            {group.fields.filter((f) => !f.isReference).length > 0 && (
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    {group.fields
                      .filter((f) => !f.isReference)
                      .map((field, fieldIndex) => (
                        <td
                          key={fieldIndex}
                          className="border border-gray-300 bg-gray-200 whitespace-nowrap"
                          style={{ fontSize: "10pt", padding: "2px 4px" }}>
                          {field.header}
                        </td>
                      ))}
                  </tr>
                  <tr>
                    {group.fields
                      .filter((f) => !f.isReference)
                      .map((field, fieldIndex) => (
                        <td
                          key={fieldIndex}
                          className="border border-gray-300 whitespace-nowrap"
                          style={{ fontSize: "10pt", padding: "2px 4px" }}>
                          {field.value}
                        </td>
                      ))}
                  </tr>
                </tbody>
              </table>
            )}
            {group.fields.find((f) => f.isReference) && (
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td
                      className="border border-gray-300 bg-gray-200"
                      style={{ fontSize: "10pt", padding: "2px 4px" }}>
                      {group.fields.find((f) => f.isReference).header}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="border border-gray-300"
                      style={{ fontSize: "10pt", padding: "2px 4px" }}>
                      {group.fields.find((f) => f.isReference).value}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnTable;
