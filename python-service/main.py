from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os

app = FastAPI()

class InvoiceRequest(BaseModel):
    rnc_emisor: str
    rnc_receptor: str
    monto: float

@app.post("/sign-ecf")
async def sign_ecf(invoice: InvoiceRequest):
    xml_firmado = f"""<?xml version=\"1.0\"?>
    <FacturaElectronica>
        <Encabezado>
            <RncEmisor>{invoice.rnc_emisor}</RncEmisor>
            <RncReceptor>{invoice.rnc_receptor}</RncReceptor>
            <Monto>{invoice.monto}</Monto>
        </Encabezado>
        <Firma>DGII-SIMULADA</Firma>
    </FacturaElectronica>"""
    
    return {
        "xml_signed": xml_firmado,
        "ncf": f"B01{os.urandom(4).hex().upper()}"
    }
