// Just to verify syntax
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const doc = new jsPDF();
console.log('jsPDF:', typeof doc);
console.log('html2canvas:', typeof html2canvas);
