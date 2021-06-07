import axios, { AxiosInstance } from 'axios';
import { INetwork } from 'src/types';
import Big from 'big.js';

export const BASE_DECIMAIL = 1e8;
export const SOURCE_CODE = 18;

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
      } else if (['crossTransferOut', 'crossTransferOutRelayFee'].includes(item.msg_type)) {
        fees[item.msg_type] = item;
      }
    });

    // bbc transfer
    const bbcFee = new Big(fees?.fixed_fee_params?.fee ?? 0).div(BASE_DECIMAIL).toString();
    const crossTransferFee = new Big(fees?.crossTransferOut?.fee ?? 0)
      .add(fees?.crossTransferOutRelayFee?.fee ?? 0)
      .toString();

    return { bbcFee, crossTransferFee };
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
