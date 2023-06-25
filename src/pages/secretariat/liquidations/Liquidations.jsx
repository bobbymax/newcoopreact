import React, { useEffect, useState } from 'react'
import PageHeader from '../../../template/includes/PageHeader'
import { alter, collection } from '../../../app/http/controllers';
import TableComponent from '../../../template/components/TableComponent';
import Alert from '../../../app/services/alert';

const Liquidations = () => {
    const [liquidations, setLiquidations] = useState([]);

    const columns = [
        {
            field: "name",
            header: "Member",
            isSortable: true,
        },
        {
            field: "loan",
            header: "Loan Code",
            isSortable: false,
        },
        {
            field: "code",
            header: "Request Code",
            isSortable: false,
        },
        {
            field: "type",
            header: "Type",
            isSortable: false,
        },
        {
            field: "amount",
            header: "Liquid Amount",
            isSortable: false,
            currency: true,
        },
        {
            field: "approved_amount",
            header: "Loan Amount",
            isSortable: false,
            approved_currency: true,
        },
        {
            field: "status",
            header: "Status",
            isSortable: false,
            status: true,
        },
    ];

    const handleApproval = (liq, stat) => {
        const status = stat === "verified" ? "approved" : "denied"

        Alert.flash(
            "Are you sure?",
            "info",
            "You would not be able to revert this!!"
          ).then((result) => {
            if (result.isConfirmed) {
              try {
                const requests = {
                    status,
                }
                alter("liquidations", liq?.id, requests)
                  .then(res => {
                    const response = res.data
                    setLiquidations(liquidations.map(liquid => {
                        if (liquid.id === response.data?.id) {
                            return response.data
                        }

                        return liquid
                    }))

                    Alert.success("Updated", response.message)
                  })
                  .catch((err) => {
                    console.log(err.message)
                    Alert.error("Oops!!", err.response.data.message)
                  });
              } catch (error) {
                console.log(error);
              }
            }
          });
    }

    useEffect(() => {
        try {
            collection("all/liquidations")
            .then((res) => {
                const response = res.data.data;
                setLiquidations(response);
            })
            .catch((err) => {
                console.log(err.message);
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

  return (
    <>
        <PageHeader  pageName='Liquidation Requests' />

        <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={liquidations}
            deposit={handleApproval}
            isSearchable
          />
        </div>
      </div>
    </>
  )
}

export default Liquidations