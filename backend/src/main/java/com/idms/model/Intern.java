package com.idms.model;
import jakarta.persistence.*;
import java.time.LocalDate;
@Entity @Table(name="interns", uniqueConstraints=@UniqueConstraint(name="uk_intern_code", columnNames="intern_id"))
public class Intern {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="intern_id", nullable=false, unique=true, updatable=false, length=20) private String internId;
 @Column(nullable=false, length=100) private String name;
 @Column(nullable=false, unique=true, length=150) private String email;
 @Column(nullable=false, length=15) private String mobileNumber;
 @Enumerated(EnumType.STRING) @Column(nullable=false, length=10) private CardType cardType;
 @Column(nullable=false) private LocalDate dateOfJoining;
 @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="batch_id", nullable=false) private Batch batch;
 public Long getId(){return id;} public String getInternId(){return internId;} public void setInternId(String v){internId=v;}
 public String getName(){return name;} public void setName(String v){name=v;} public String getEmail(){return email;} public void setEmail(String v){email=v;}
 public String getMobileNumber(){return mobileNumber;} public void setMobileNumber(String v){mobileNumber=v;} public CardType getCardType(){return cardType;} public void setCardType(CardType v){cardType=v;}
 public LocalDate getDateOfJoining(){return dateOfJoining;} public void setDateOfJoining(LocalDate v){dateOfJoining=v;}
 public Batch getBatch(){return batch;} public void setBatch(Batch v){batch=v;}
}
