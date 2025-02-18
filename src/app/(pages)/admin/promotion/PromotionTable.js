// src/app/(pages)/admin/promotion/PromotionTable.js
import React from "react";
import { Edit, Trash } from "lucide-react";
import "@app/(pages)/admin/promotion/CssPromotion.css";

const PromotionTable = ({ promotions, handleEdit, handleDelete }) => {
  return (
    <div>
      <div className="tbl-header">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Sale</th>
              <th>Free</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="tbl-content">
        <table>
          <tbody>
            {promotions.map((promo, index) => (
              <tr key={promo.id}>
                <td>{index + 1}</td>
                <td>{promo.name}</td>
                <td>{promo.description}</td>
                <td>{promo.status}</td>
                <td>{promo.sale}</td>
                <td>{promo.free}</td>
                <td>{promo.startdate}</td>
                <td>{promo.enddate}</td>
                <td>
                  <button onClick={() => handleEdit(promo.id)} className="text-blue-500 hover:text-blue-700"><Edit size={20} /></button>
                  <button onClick={() => handleDelete(promo.id)} className="text-red-500 hover:text-red-700 ml-2"><Trash size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromotionTable;
