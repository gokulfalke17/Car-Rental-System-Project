package com.mgmt.entity;

public class VariantInfo {

    private String variantName;
    private String companyName;
    private Double rentPerDay;

    public VariantInfo(String variantName, String companyName, Double rentPerDay) {
        this.variantName = variantName;
        this.companyName = companyName;
        this.rentPerDay = rentPerDay;
    }

    // Getters and setters
    public String getVariantName() {
        return variantName;
    }

    public void setVariantName(String variantName) {
        this.variantName = variantName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Double getRentPerDay() {
        return rentPerDay;
    }

    public void setRentPerDay(Double rentPerDay) {
        this.rentPerDay = rentPerDay;
    }
}
