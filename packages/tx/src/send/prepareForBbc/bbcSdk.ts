import axios, { AxiosInstance } from 'axios';
import Big from 'big.js';
import { INetwork } from 'src/types';
import { BBC_BASE_DECIMAIL } from 'src/constants';

const divideBase = (n: Big) => n.div(BBC_BASE_DECIMAIL).toString();

export class BbcSdk {
  network: INetwork;
  http: AxiosInstance;

  constructor({ network }: { network: INetwork }) {
    this.network = network;
    this.http = axios.create({
      baseURL: network.url,
    });
  }

  getGasPrice = async () => {
    const url = `/api/v1/fees`;
    const res = await this.http.get<Array<{ [k: string]: any }>>(url).then((res) => res.data);
    const fees: { [k: string]: any } = {};

    res.forEach((item) => {
      if (item.fixed_fee_params) {
        fees[item.fixed_fee_params] = item.fixed_fee_params;
      } else {
        fees[item.msg_type] = item;
      }
    });

    // bbc transfer
    const transfer = divideBase(new Big(fees?.fixed_fee_params?.fee ?? 0));
    const transferToBsc = divideBase(
      new Big(fees?.crossTransferOut?.fee ?? 0).add(fees?.crossTransferOutRelayFee?.fee ?? 0),
    );

    return {
      transfer,
      transferToBsc,
      delegate: divideBase(new Big(fees?.side_delegate?.fee ?? 0)),
      undelegate: divideBase(new Big(fees?.side_undelegate?.fee ?? 0)),
      redelegate: divideBase(new Big(fees?.side_redelegate?.fee ?? 0)),
    };
  };

  getAccount = async (address: string) => {
    const url = `/api/v1/account/${address}`;
    const res = await this.http.get<{ sequence: number; account_number: number }>(url);

    if (res.statusText !== 'OK') {
      throw new Error(`Failed to call sequence API: ${url} ${res.data}`);
    }

    return res.data;
  };

  getNodeInfo = async () => {
    const url = `/api/v1/node-info`;
    const res = await this.http.get<{ node_info: { network: string } }>(url);

    if (res.statusText !== 'OK') {
      throw new Error(`Failed to call node info API: ${url} ${res.data}`);
    }

    return res.data;
  };
}
