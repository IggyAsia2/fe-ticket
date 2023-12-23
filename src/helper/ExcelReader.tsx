import { importInven } from '@/api/inventory';
import { CurrentUser } from '@/helper/helper';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Space, Upload, message } from 'antd';
import { useState } from 'react';
import { useAccess } from '@umijs/max';
import XLSX from 'xlsx';

const SheetJSFT: string = ['xlsx']
  .map(function (x: string): string {
    return '.' + x;
  })
  .join(',');

// interface Column {
//   name: string;
//   key: number;
// }

// const make_cols = (refstr: any): Column[] => {
//   let o: Column[] = [],
//     C: number = XLSX.utils.decode_range(refstr).e.c + 1;
//   for (let i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
//   return o;
// };

export type CreateFormProps = {
  checkData: string[];
  actionRef: any;
};

const ExcelReader: React.FC<CreateFormProps> = (props) => {
  const access = useAccess();
  const [file, setFile] = useState<any>({});
  const [isFile, setIsFile] = useState<boolean>(true);
  const { checkData, actionRef } = props;
  const email: string | undefined = CurrentUser()?.email;

  const importTicket = async ({ data, importUser, purchaseId }: any) => {
    const hide = message.loading('Đang nhập vé');
    try {
      await importInven({
        data,
        importUser,
        purchaseId
      });

      hide();
      message.success('Đã nhập vé thành công');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return true;
    } catch (error) {
      hide();
      message.error('Nhập vé không thành công');
      window.location.reload();
      return false;
    }
  };

  const handleFile = (): void => {
    /* Boilerplate to set up FileReader */
    const reader: FileReader = new FileReader();
    const rABS: boolean = !!reader.readAsBinaryString;

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      /* Parse data */
      const bstr: string = e.target!.result as string;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {
        type: rABS ? 'binary' : 'array',
        bookVBA: true,
      });
      /* Get first worksheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      /* Convert array of arrays */
      const dete: any[] = XLSX.utils.sheet_to_json(ws);
      /* Update state */
      // setCols(make_cols(ws['!ref']))
      // console.log(JSON.stringify(dete, null, 2));
      // const newDete = dete.map((el: any) => {
      //   const groupTicketId: any = checkData.find((item: any) => item.sku === el.Sku);
      //   if (groupTicketId)
      //     return {
      //       name: el['Tên SP'],
      //       serial: el.Serial,
      //       code: el.Code,
      //       purchaseId: el.PurchaseId,
      //       activatedDate: el.ActivatedDate,
      //       expiredDate: el.ExpiredDate,
      //       importUser: email,
      //       groupTicket: groupTicketId?.id,
      //       state: 'Pending',
      //     };
      // });

      const newDete: any = [];
      const newDate = new Date();
      const timTem = newDate.getTime();

      dete.forEach((el: any) => {
        const groupTicket: any = checkData.find((item: any) => item.sku === el.Sku);
        if (groupTicket)
          newDete.push({
            name: el['Tên SP'],
            serial: el.Serial,
            code: el.Code,
            purchaseId: timTem,
            activatedDate: el.ActivatedDate,
            expiredDate: el.ExpiredDate,
            importUser: email,
            sku: el.Sku,
            groupName: groupTicket.name,
            bigTicket: groupTicket.bigTicket,
            unit: groupTicket.unit,
            quantity: 1,
            groupTicket: groupTicket?.id,
            state: 'Pending',
          });
      });
      const success = await importTicket({ data: newDete, importUser: email, purchaseId: timTem });
      setFile({});
      if (success) {
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    };

    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <Space>
      <Upload
        className="form-control"
        accept={SheetJSFT}
        // onChange={handleChange}
        maxCount={1}
        beforeUpload={(file: any) => {
          let isExcel: boolean = false;
          if (file.name.search('.xlsx') !== -1) isExcel = true;
          if (!isExcel) {
            message.error(`${file.name} Xin mời nhập file Excel`);
          } else {
            setFile(file);
            setIsFile(false);
          }
          return isExcel || Upload.LIST_IGNORE;
        }}
        onRemove={() => setIsFile(true)}
      >
        <Button hidden={!access.canAdmin} icon={<UploadOutlined />}>
          Chọn File nhập vé
        </Button>
      </Upload>
      <Input
        hidden={!access.canAdmin}
        disabled={isFile}
        type="submit"
        value="Nhập vé"
        onClick={handleFile}
      />
    </Space>
  );
};

export default ExcelReader;
