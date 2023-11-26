import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 20,
  },
});

const ReceiptPDF = ({ order }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View>
          <Text style={styles.title}>Invoice #: {order._id}{'\n'}{'\n'}</Text>
          <Text style={styles.text}>To: {order.user && order.user.name}</Text>
          <Text style={styles.text}>Address: {order.shippingInfo && order.shippingInfo.address}</Text>
          <Text style={styles.text}>Phone: {order.shippingInfo && order.shippingInfo.phoneNo}</Text>
          <Text style={styles.text}>Status: {order.orderStatus}{'\n'}{'\n'}</Text>
          <Text style={styles.text}>Items:</Text>
          </View>
          <View>
            {order.orderItems && order.orderItems.map((item, index) => (
              <Text key={index} style={styles.text}>
                *PHOTO: {item.Pname} - MATERIAL: {item.Mname} - QUANTITY: {item.quantity} - PRICE: {item.price} - AMOUNT: {(item.price * item.quantity)}
              </Text>
            ))}
          </View>
          <Text style={styles.text}>{'\n'}{'\n'}Subtotal: {order.itemsPrice} php</Text>
          <Text style={styles.text}>Shipping: {order.shippingPrice} php</Text>
          <Text style={styles.text}>Tax (0.5%): {order.taxPrice} php</Text>
          <Text style={styles.text}>{'\n'}{'\n'}Total Amount: {order.totalPrice} php</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptPDF;
